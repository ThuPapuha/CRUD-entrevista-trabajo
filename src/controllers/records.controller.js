const recordsService = require("../services/records.service");

async function createRecord(req, res, next) {
  try {
    const record = await recordsService.createRecord(req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function getRecords(_req, res, next) {
  try {
    const records = await recordsService.getRecords();
    res.json(records);
  } catch (error) {
    next(error);
  }
}

async function getRecordById(req, res, next) {
  try {
    const record = await recordsService.getRecordById(req.params.id);
    res.json(record);
  } catch (error) {
    next(error);
  }
}

async function updateRecord(req, res, next) {
  try {
    const record = await recordsService.updateRecord(req.params.id, req.body);
    res.json(record);
  } catch (error) {
    next(error);
  }
}

async function deleteRecord(req, res, next) {
  try {
    await recordsService.deleteRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
