const { body, param, validationResult } = require("express-validator");

const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
const postalCodePattern = /^\d{5}$/;

const fullNameRule = body("fullName")
  .trim()
  .notEmpty()
  .withMessage("El nombre completo es requerido.")
  .isLength({ min: 3, max: 120 })
  .withMessage("El nombre completo debe tener entre 3 y 120 caracteres.");

const rfcRule = body("rfc")
  .trim()
  .toUpperCase()
  .notEmpty()
  .withMessage("El RFC es requerido.")
  .matches(rfcPattern)
  .withMessage("El RFC no tiene un formato válido.");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("El correo electrónico es requerido.")
  .isEmail()
  .withMessage("El correo electrónico no tiene un formato válido.")
  .normalizeEmail();

const postalCodeRule = body("postalCode")
  .trim()
  .notEmpty()
  .withMessage("El código postal es requerido.")
  .matches(postalCodePattern)
  .withMessage("El código postal debe contener 5 dígitos.");

const idParamRules = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo.")
    .toInt()
];

const createRecordRules = [fullNameRule, rfcRule, emailRule, postalCodeRule];
const updateRecordRules = [fullNameRule, rfcRule, emailRule, postalCodeRule];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({
    message: "Datos de entrada inválidos.",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });
}

module.exports = {
  createRecordRules,
  updateRecordRules,
  idParamRules,
  validateRequest
};
