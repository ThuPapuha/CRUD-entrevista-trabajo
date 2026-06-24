const { AppError } = require("../utils/app-error");

function notFoundHandler(req, _res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error instanceof AppError ? error.message : "Error interno del servidor.";

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
