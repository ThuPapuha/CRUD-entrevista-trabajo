"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  CheckCircle2,
  Edit3,
  LogIn,
  LogOut,
  Loader2,
  RefreshCcw,
  Save,
  Trash2,
  X
} from "lucide-react";

const initialForm = {
  fullName: "",
  rfc: "",
  email: "",
  postalCode: ""
};

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function Home() {
  const auth = useAuth();
  const apiUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    []
  );
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function request(path, options = {}) {
    const token = auth.user?.access_token;
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo completar la operacion.");
    }

    return data;
  }

  async function loadRecords() {
    if (!auth.isAuthenticated) {
      setRecords([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await request("/api/records");
      setRecords(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth.isLoading) {
      loadRecords();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.access_token]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  }

  function startEdit(record) {
    setForm({
      fullName: record.fullName,
      rfc: record.rfc,
      email: record.email,
      postalCode: record.postalCode
    });
    setEditingId(record.id);
    setStatus("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!auth.isAuthenticated) {
      setError("Inicia sesion para crear registros.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    setError("");

    try {
      const path = editingId ? `/api/records/${editingId}` : "/api/records";
      const method = editingId ? "PUT" : "POST";

      await request(path, {
        method,
        body: JSON.stringify(form)
      });

      setStatus(editingId ? "Registro actualizado." : "Registro creado.");
      resetForm();
      await loadRecords();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteRecord(id) {
    if (!auth.isAuthenticated) {
      setError("Inicia sesion para eliminar registros.");
      return;
    }

    setStatus("");
    setError("");

    try {
      await request(`/api/records/${id}`, { method: "DELETE" });
      setStatus("Registro eliminado.");
      await loadRecords();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function signOut() {
    auth.removeUser();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CRUD MySQL</p>
          <h1>Registros</h1>
        </div>
        <div className="topbar-actions">
          {auth.isAuthenticated ? (
            <button className="ghost-button" type="button" onClick={signOut}>
              <LogOut size={16} />
              Salir
            </button>
          ) : (
            <button className="ghost-button" type="button" onClick={() => auth.signinRedirect()}>
              <LogIn size={16} />
              Entrar
            </button>
          )}
          <button className="icon-button" type="button" onClick={loadRecords} title="Actualizar registros">
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      {auth.isLoading && (
        <section className="auth-panel">
          <Loader2 className="spin" size={18} />
          Cargando sesion...
        </section>
      )}

      {auth.error && <section className="auth-panel error">{auth.error.message}</section>}

      {!auth.isLoading && !auth.isAuthenticated && (
        <section className="auth-panel">
          Inicia sesion con Cognito para consultar y modificar registros.
        </section>
      )}

      <section className="content-grid">
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h2>{editingId ? "Editar registro" : "Nuevo registro"}</h2>
            {editingId && (
              <button className="ghost-button" type="button" onClick={resetForm}>
                <X size={16} />
                Cancelar
              </button>
            )}
          </div>

          <label>
            Nombre completo
            <input
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              placeholder="Juan Perez Lopez"
              required
            />
          </label>

          <label>
            RFC
            <input
              name="rfc"
              value={form.rfc}
              onChange={updateField}
              placeholder="PELJ800101ABC"
              required
            />
          </label>

          <label>
            Correo electronico
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="juan@example.com"
              required
            />
          </label>

          <label>
            Codigo postal
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={updateField}
              placeholder="01000"
              inputMode="numeric"
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
            {editingId ? "Guardar cambios" : "Crear registro"}
          </button>

          {status && (
            <p className="success">
              <CheckCircle2 size={16} />
              {status}
            </p>
          )}
          {error && <p className="error">{error}</p>}
        </form>

        <section className="table-panel">
          <div className="panel-heading">
            <h2>Lista de registros</h2>
            {loading && <Loader2 className="spin muted" size={18} />}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RFC</th>
                  <th>Correo</th>
                  <th>Codigo postal</th>
                  <th>Actualizado</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fullName}</td>
                    <td>{record.rfc}</td>
                    <td>{record.email}</td>
                    <td>{record.postalCode}</td>
                    <td>{formatDate(record.updatedAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          type="button"
                          onClick={() => startEdit(record)}
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="icon-button danger"
                          type="button"
                          onClick={() => deleteRecord(record.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && records.length === 0 && (
                  <tr>
                    <td className="empty" colSpan="6">
                      Sin registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
