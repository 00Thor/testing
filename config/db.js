// const { Pool } = require('pg');

// const db = new Pool({
//   user: process.env.DB_USER,        // PostgreSQL username
//   host: process.env.DB_HOST,        // Hostname or IP of the database
//   database: process.env.DB_NAME,    // Database name
//   password: process.env.DB_PASSWORD, // Password for the database user
//   port: process.env.DB_PORT || 5432, // Default PostgreSQL port
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL for production
// });

// module.exports = db;
const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DB_PASSWORD || typeof process.env.DB_PASSWORD !== "string") {
  throw new Error("Database password is not properly set in the environment variables.");
}

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: `${process.env.DB_PASSWORD}`, // Ensure password is a string
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  ssl: {
    rejectUnauthorized: false, // For Azure PostgreSQL
  },
});

module.exports = db;


