const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const createApp = require("../src/app");

test("GET /health returns ok", async () => {
  const response = await request(createApp()).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("POST /api/records validates required fields", async () => {
  const response = await request(createApp()).post("/api/records").send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Datos de entrada inválidos.");
  assert.ok(response.body.errors.length >= 4);
});

test("POST /api/records validates RFC format", async () => {
  const response = await request(createApp()).post("/api/records").send({
    fullName: "Juan Perez Lopez",
    rfc: "INVALIDO",
    email: "juan@example.com",
    postalCode: "01000"
  });

  assert.equal(response.status, 400);
  assert.ok(response.body.errors.some((error) => error.field === "rfc"));
});
