const pool = require("../config/database");

const selectFields = `
  id,
  full_name AS fullName,
  rfc,
  email,
  postal_code AS postalCode,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

async function create({ fullName, rfc, email, postalCode }) {
  const [result] = await pool.execute(
    `INSERT INTO records (full_name, rfc, email, postal_code)
     VALUES (:fullName, :rfc, :email, :postalCode)`,
    { fullName, rfc, email, postalCode }
  );

  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${selectFields}
     FROM records
     ORDER BY id DESC`
  );

  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT ${selectFields}
     FROM records
     WHERE id = :id`,
    { id }
  );

  return rows[0] || null;
}

async function findByRfcOrEmail(rfc, email) {
  const [rows] = await pool.execute(
    `SELECT ${selectFields}
     FROM records
     WHERE rfc = :rfc OR email = :email
     LIMIT 1`,
    { rfc, email }
  );

  return rows[0] || null;
}

async function findByRfcOrEmailExcludingId(rfc, email, id) {
  const [rows] = await pool.execute(
    `SELECT ${selectFields}
     FROM records
     WHERE (rfc = :rfc OR email = :email) AND id <> :id
     LIMIT 1`,
    { rfc, email, id }
  );

  return rows[0] || null;
}

async function update(id, { fullName, rfc, email, postalCode }) {
  await pool.execute(
    `UPDATE records
     SET full_name = :fullName,
         rfc = :rfc,
         email = :email,
         postal_code = :postalCode
     WHERE id = :id`,
    { id, fullName, rfc, email, postalCode }
  );
}

async function remove(id) {
  await pool.execute(
    `DELETE FROM records
     WHERE id = :id`,
    { id }
  );
}

module.exports = {
  create,
  findAll,
  findById,
  findByRfcOrEmail,
  findByRfcOrEmailExcludingId,
  update,
  remove
};
