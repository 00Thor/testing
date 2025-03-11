const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER,        // PostgreSQL username
  host: process.env.DB_HOST,        // Hostname or IP of the database
  database: process.env.DB_NAME,    // Database name
  password: process.env.DB_PASSWORD, // Password for the database user
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Enable SSL
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch((err) => console.error('Database connection error:', err.stack));

module.exports = db;
