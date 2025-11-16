// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const earn_id = crypto.randomBytes(8).toString('hex');
        
        const newUserQuery = await client.query(
            `INSERT INTO users (username, email, password_hash, avatar_url, earn_id) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, username, email, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id`,
            [username, email, password_hash, `https://i.pravatar.cc/150?u=${username}`, earn_id]
        );

        const user = newUserQuery.rows[0];

        await client.query('COMMIT');
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, user: snakeToCamel(user) });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        if (error.code === '23505') { // Unique constraint violation
             return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: error.message || 'Server error during signup.' });
    } finally {
        client.release();
    }
});

app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            `SELECT id, username, email, password_hash, avatar_url, created_at AS joined_date, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank, earn_id 
             FROM users WHERE email = $1`, 
            [email]
        );
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
    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Admin login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during admin signin.' });
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
    
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
        const userBalance = parseFloat(userResult.rows[0].balance);

        if (userBalance < withdrawalAmount) {
            throw new Error('Insufficient balance.');
        }

        await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [withdrawalAmount, req.user.id]);

        const newTransactionQuery = await client.query(
            `INSERT INTO transactions (id, user_id, type, method, amount, status, date) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             RETURNING *`,
            [id, req.user.id, type, method, withdrawalAmount, status]
        );
        
        await client.query('COMMIT');
        res.status(201).json(snakeToCamel(newTransactionQuery.rows[0]));
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json({ message: error.message || 'Server error creating withdrawal.' });
    } finally {
        client.release();
    }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
    try {
        const stats = {};
        const totalUsersRes = await pool.query('SELECT COUNT(*) FROM users');
        stats.totalUsers = parseInt(totalUsersRes.rows[0].count, 10);

        const newUsersRes = await pool.query("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'");
        stats.newUsersLast30Days = parseInt(newUsersRes.rows[0].count, 10);

        const totalTasksRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Task Reward' AND status = 'Completed'");
        stats.tasksCompletedAllTime = parseInt(totalTasksRes.rows[0].count, 10);

        const recentTasksRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Task Reward' AND status = 'Completed' AND date >= NOW() - INTERVAL '30 days'");
        stats.tasksCompletedLast30Days = parseInt(recentTasksRes.rows[0].count, 10);

        const totalPaidOutRes = await pool.query("SELECT SUM(amount) FROM transactions WHERE type = 'Withdrawal' AND status = 'Completed'");
        stats.totalPaidOut = parseFloat(totalPaidOutRes.rows[0].sum) || 0;
        
        const pendingWithdrawalsRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Withdrawal' AND status = 'Pending'");
        stats.pendingWithdrawals = parseInt(pendingWithdrawalsRes.rows[0].count, 10);
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching stats.' });
    }
});

app.get('/api/admin/recent-tasks', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.id AS transaction_id, t.date, u.email, t.amount
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Task Reward' AND t.status = 'Completed'
            ORDER BY t.date DESC
            LIMIT 5
        `);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching recent tasks:', error);
        res.status(500).json({ message: 'Server error fetching recent tasks.' });
    }
});

app.get('/api/admin/recent-signups', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT email, created_at AS joined_date
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching recent signups:', error);
        res.status(500).json({ message: 'Server error fetching recent signups.' });
    }
});

// Get all withdrawal transactions for admin panel, with pagination
app.get('/api/admin/transactions', authMiddleware, async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
        const baseQuery = `
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Withdrawal'
        `;

        const totalResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`);
        const totalItems = parseInt(totalResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / limit);

        const transactionsResult = await pool.query(`
            SELECT t.*, u.email 
            ${baseQuery}
            ORDER BY 
                CASE t.status
                    WHEN 'Pending' THEN 1
                    WHEN 'Completed' THEN 2
                    WHEN 'Rejected' THEN 3
                    ELSE 4
                END, 
                t.date DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);

        if (req.query.limit) { // If a limit is specified, just return the array
            res.json(transactionsResult.rows.map(snakeToCamel));
        } else { // Otherwise, return the paginated response
            res.json({
                transactions: transactionsResult.rows.map(snakeToCamel),
                currentPage: page,
                totalPages,
                totalItems
            });
        }
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

        const transactionResult = await client.query('SELECT * FROM transactions WHERE id = $1 FOR UPDATE', [id]);
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
        } else if (status === 'Rejected') {
            await client.query(
                'UPDATE users SET balance = balance + $1 WHERE id = $2',
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
    if (typeof obj !== 'object' || obj === null || obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = snakeToCamel(value); // Recursively convert nested objects
        return acc;
    }, {});
};

const seedAdmin = async () => {
    const client = await pool.connect();
    try {
        const adminEmail = 'raihansarker270@gmail.com';
        const adminCheck = await client.query('SELECT * FROM admins WHERE email = $1', [adminEmail]);
        if (adminCheck.rows.length === 0) {
            console.log('Creating default admin user...');
            const salt = await bcrypt.genSalt(10);
            const adminPasswordHash = await bcrypt.hash('Wh1@Wh1@', salt);
            await client.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [adminEmail, adminPasswordHash]);
            console.log('Default admin user created.');
        }
    } catch (err) {
        console.error('Error seeding admin user:', err.stack);
    } finally {
        client.release();
    }
};

// Start Server
app.listen(port, () => {
  initDb();
  seedAdmin();
  console.log(`Server running on http://localhost:${port}`);
});