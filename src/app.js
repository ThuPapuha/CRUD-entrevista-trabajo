const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const recordsRoutes = require("./routes/records.routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "Node MySQL CRUD Service",
      status: "ok",
      endpoints: {
        health: "GET /health",
        records: {
          create: "POST /api/records",
          list: "GET /api/records",
          getById: "GET /api/records/:id",
          update: "PUT /api/records/:id",
          delete: "DELETE /api/records/:id"
        }
      }
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/records", recordsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
