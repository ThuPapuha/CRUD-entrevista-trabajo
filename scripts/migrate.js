require("dotenv").config();

const mysql = require("mysql2/promise");
const { env } = require("../src/config/env");

async function migrate() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
  await connection.query(`USE \`${env.db.database}\``);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS records (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      full_name VARCHAR(120) NOT NULL,
      rfc VARCHAR(13) NOT NULL,
      email VARCHAR(160) NOT NULL,
      postal_code CHAR(5) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY records_rfc_unique (rfc),
      UNIQUE KEY records_email_unique (email)
    )
  `);

  await connection.end();
  console.log(`Database migrated: ${env.db.database}`);
}

migrate().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
