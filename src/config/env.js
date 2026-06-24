require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || process.env.RDS_HOSTNAME || "localhost",
    port: Number(process.env.DB_PORT || process.env.RDS_PORT) || 3306,
    user: process.env.DB_USER || process.env.RDS_USERNAME || "root",
    password: process.env.DB_PASSWORD || process.env.RDS_PASSWORD || "",
    database: process.env.DB_NAME || process.env.RDS_DB_NAME || "crud_service"
  }
};

module.exports = { env };
