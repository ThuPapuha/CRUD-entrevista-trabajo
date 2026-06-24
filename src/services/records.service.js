const recordsRepository = require("../repositories/records.repository");
const { AppError } = require("../utils/app-error");

async function createRecord(payload) {
  const existingRecord = await recordsRepository.findByRfcOrEmail(payload.rfc, payload.email);

  if (existingRecord) {
    throw new AppError("Ya existe un registro con ese RFC o correo electrónico.", 409);
  }

  return recordsRepository.create(payload);
}

async function getRecords() {
  return recordsRepository.findAll();
}

async function getRecordById(id) {
  const record = await recordsRepository.findById(id);

  if (!record) {
    throw new AppError("Registro no encontrado.", 404);
  }

  return record;
}

async function updateRecord(id, payload) {
  await getRecordById(id);

  const existingRecord = await recordsRepository.findByRfcOrEmailExcludingId(
    payload.rfc,
    payload.email,
    id
  );

  if (existingRecord) {
    throw new AppError("Ya existe otro registro con ese RFC o correo electrónico.", 409);
  }

  await recordsRepository.update(id, payload);
  return getRecordById(id);
}

async function deleteRecord(id) {
  await getRecordById(id);
  await recordsRepository.remove(id);
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
