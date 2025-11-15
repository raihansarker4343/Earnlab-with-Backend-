// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initDb } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // Create a default user object
        const newUserQuery = await pool.query(
            `INSERT INTO users (username, email, password_hash, avatar_url, referral_earnings) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, username, email, avatar_url, created_at, total_earned, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank`,
            [username, email, password_hash, `https://i.pravatar.cc/150?u=${username}`, 25.75]
        );

        const user = newUserQuery.rows[0];
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, user: snakeToCamel(user) });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // Unique constraint violation
             return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        delete user.password_hash; // Don't send password hash to client
        res.json({ token, user: snakeToCamel(user) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signin.' });
    }
});

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    // This is a mock admin login. For a real app, you would check credentials against the 'admins' table.
    if (email === 'admin@earnlab.com' && password === 'password') {
         res.status(200).json({ message: 'Admin login successful' });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

// Helper to convert snake_case from DB to camelCase for frontend
const snakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = value;
        return acc;
    }, {});
};

// Start Server
app.listen(port, () => {
  initDb();
  console.log(`Server running on http://localhost:${port}`);
});