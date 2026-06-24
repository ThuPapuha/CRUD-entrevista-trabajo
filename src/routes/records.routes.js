const { Router } = require("express");
const recordsController = require("../controllers/records.controller");
const {
  createRecordRules,
  updateRecordRules,
  idParamRules,
  validateRequest
} = require("../validators/records.validator");

const router = Router();

router.post("/", createRecordRules, validateRequest, recordsController.createRecord);
router.get("/", recordsController.getRecords);
router.get("/:id", idParamRules, validateRequest, recordsController.getRecordById);
router.put("/:id", idParamRules, updateRecordRules, validateRequest, recordsController.updateRecord);
router.delete("/:id", idParamRules, validateRequest, recordsController.deleteRecord);

module.exports = router;
