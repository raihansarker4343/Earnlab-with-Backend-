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

// Middleware to verify JWT and attach user to request
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

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
            `INSERT INTO users (username, email, password_hash, avatar_url, referral_earnings, total_earned) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, username, email, avatar_url, created_at, total_earned, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank`,
            [username, email, password_hash, `https://i.pravatar.cc/150?u=${username}`, 25.75, 50.00] // Start with some earnings
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

// --- TRANSACTION ROUTES ---

// Get transactions for the logged-in user
app.get('/api/transactions', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching transactions.' });
    }
});

// Create a new withdrawal transaction
app.post('/api/transactions/withdraw', authMiddleware, async (req, res) => {
    const { id, method, amount, status, type } = req.body;
    if (!id || !method || !amount || !status || !type) {
        return res.status(400).json({ message: 'Missing required transaction fields.' });
    }

    try {
        const newTransactionQuery = await pool.query(
            `INSERT INTO transactions (id, user_id, type, method, amount, status, date) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             RETURNING *`,
            [id, req.user.id, type, method, amount, status]
        );
        res.status(201).json(snakeToCamel(newTransactionQuery.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating withdrawal.' });
    }
});

// --- ADMIN ROUTES ---

// Get all withdrawal transactions for admin panel
app.get('/api/admin/transactions', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, u.email 
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Withdrawal' 
            ORDER BY 
                CASE t.status
                    WHEN 'Pending' THEN 1
                    WHEN 'Completed' THEN 2
                    WHEN 'Rejected' THEN 3
                    ELSE 4
                END, 
                t.date DESC
        `);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching admin transactions.' });
    }
});

// Update a transaction's status (approve/reject)
app.patch('/api/admin/transactions/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    if (!status || !['Completed', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const transactionResult = await client.query('SELECT * FROM transactions WHERE id = $1', [id]);
        if (transactionResult.rows.length === 0) {
            throw new Error('Transaction not found');
        }
        const transaction = transactionResult.rows[0];
        
        if (transaction.status !== 'Pending') {
            throw new Error('Transaction is not in a pending state.');
        }

        const updatedTransactionQuery = await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        const updatedTransaction = updatedTransactionQuery.rows[0];

        if (status === 'Completed') {
            await client.query(
                'UPDATE users SET total_withdrawn = total_withdrawn + $1 WHERE id = $2',
                [transaction.amount, transaction.user_id]
            );
        }

        await client.query('COMMIT');
        res.json(snakeToCamel(updatedTransaction));

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error updating transaction.' });
    } finally {
        client.release();
    }
});


// Helper to convert snake_case from DB to camelCase for frontend
const snakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = snakeToCamel(value); // Recursively convert nested objects
        return acc;
    }, {});
};

// Start Server
app.listen(port, () => {
  initDb();
  console.log(`Server running on http://localhost:${port}`);
});