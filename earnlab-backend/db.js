// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        total_earned NUMERIC(10, 2) DEFAULT 0,
        balance NUMERIC(10, 2) DEFAULT 0,
        last_30_days_earned NUMERIC(10, 2) DEFAULT 0,
        completed_tasks INTEGER DEFAULT 0,
        total_wagered NUMERIC(10, 2) DEFAULT 0,
        total_profit NUMERIC(10, 2) DEFAULT 0,
        total_withdrawn NUMERIC(10, 2) DEFAULT 0,
        total_referrals INTEGER DEFAULT 0,
        referral_earnings NUMERIC(10, 2) DEFAULT 0,
        xp INTEGER DEFAULT 0,
        rank VARCHAR(50) DEFAULT 'Newbie'
      );

      CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        method VARCHAR(100) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(50)
      );
    `);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database schema:', err.stack);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDb };