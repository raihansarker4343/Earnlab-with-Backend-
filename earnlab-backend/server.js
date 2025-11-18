
require('dotenv').config(); // Load env vars first!
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, initDb, logIpData } = require('./db');
const checkIpWithIPHub = require('./middleware/ipHubMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Enable trust proxy to get real IP addresses behind load balancers (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Helper to convert snake_case to camelCase for frontend consistency
const snakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    
    const newObj = {};
    for (const key in obj) {
        const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[newKey] = snakeToCamel(obj[key]);
    }
    return newObj;
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const adminAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        req.user = user;
        next();
    });
};

// --- Seed Data Functions ---
// These populate the DB if empty. You can update image links here for fresh installs.

const seedPaymentMethods = async () => {
    const count = await pool.query('SELECT COUNT(*) FROM payment_methods');
    if (parseInt(count.rows[0].count) === 0) {
        console.log('Seeding payment methods...');
        const methods = [
            { name: 'PayPal', icon_class: 'fab fa-paypal', type: 'cash' },
            { name: 'Bitcoin', icon_class: 'fab fa-bitcoin', type: 'crypto' },
            { name: 'Ethereum', icon_class: 'fab fa-ethereum', type: 'crypto' },
            { name: 'Litecoin', icon_class: 'fas fa-litecoin-sign', type: 'crypto' },
            { name: 'Dogecoin', icon_class: 'fas fa-dog', type: 'crypto' },
            { name: 'Visa', icon_class: 'fab fa-cc-visa', type: 'cash' },
            { name: 'Amazon', icon_class: 'fab fa-amazon', type: 'special', special_bonus: '+5%' },
            { name: 'Steam', icon_class: 'fab fa-steam', type: 'special' },
        ];
        for (const m of methods) {
            await pool.query(
                'INSERT INTO payment_methods (name, icon_class, type, special_bonus) VALUES ($1, $2, $3, $4)',
                [m.name, m.icon_class, m.type, m.special_bonus]
            );
        }
    }
};

const seedSurveyProviders = async () => {
    const count = await pool.query('SELECT COUNT(*) FROM survey_providers');
    if (parseInt(count.rows[0].count) === 0) {
        console.log('Seeding survey providers...');
        const providers = [
            { name: 'BitLabs', logo: 'https://i.imgur.com/oZznueX.png', rating: 3, type: 'BitLabs' },
            { name: 'CPX Research', logo: 'https://i.imgur.com/ssL8ALh.png', rating: 3, type: 'CPX RESEARCH' },
            { name: 'Your-Surveys', logo: 'https://i.imgur.com/pLRnBU2.png', rating: 4, type: 'Your-Surveys' },
            { name: 'Pollfish', logo: 'https://i.imgur.com/OofFwSR.png', rating: 4, type: 'Pollfish' },
            { name: 'Prime Surveys', logo: 'https://i.imgur.com/0EGYRXz.png', rating: 3, type: 'Prime Surveys' },
            { name: 'inBrain', logo: 'https://i.imgur.com/p2jQpqv.png', rating: 2, type: 'inBrain' },
            { name: 'Adscend Media Surveys', logo: 'https://i.imgur.com/CM6xxOM.png', rating: 4, type: 'Adscend Media' },
            { name: 'TheoremReach', logo: 'https://i.imgur.com/yvC5YyW.png', rating: 4, type: 'TheoremReach', unlock_requirement: 'Level 5+', is_locked: true },
        ];
        for (const p of providers) {
            await pool.query(
                'INSERT INTO survey_providers (name, logo, rating, type, unlock_requirement, is_locked) VALUES ($1, $2, $3, $4, $5, $6)',
                [p.name, p.logo, p.rating, p.type, p.unlock_requirement, p.is_locked || false]
            );
        }
    }
};

const seedOfferWalls = async () => {
    const count = await pool.query('SELECT COUNT(*) FROM offer_walls');
    if (parseInt(count.rows[0].count) === 0) {
        console.log('Seeding offer walls...');
        const walls = [
            { name: 'Torox', logo: 'https://i.imgur.com/zbyfSVW.png', bonus: '+20%' },
            { name: 'Adscend Media', logo: 'https://i.imgur.com/iY9g04E.png', bonus: '+50%' },
            { name: 'AdToWall', logo: 'https://i.imgur.com/x0iP1C9.png' },
            { name: 'RevU', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $2.50 to unlock', bonus: '+50%' },
            { name: 'AdGate Media', logo: 'https://i.imgur.com/Q2yG7nS.png' },
            { name: 'MyChips', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $2.50 to unlock', bonus: '+50%' },
            { name: 'MM Wall', logo: 'https://i.imgur.com/6XzWfP1.png' },
            { name: 'Aye-T Studios', logo: 'https://i.imgur.com/J3t5e6E.png' },
            { name: 'Monlix', logo: 'https://i.imgur.com/ePFr12w.png' },
            { name: 'Hang My Ads', logo: 'https://i.imgur.com/yvC5YyW.png', is_locked: true, unlock_requirement: 'Earn $1.00 to unlock' },
            { name: 'Lootably', logo: 'https://i.imgur.com/i9nO27d.png' },
            { name: 'Time Wall', logo: 'https://i.imgur.com/nJgq1t7.png' },
            { name: 'AdGem', logo: 'https://i.imgur.com/r9f5k2Z.png' },
        ];
        for (const w of walls) {
            await pool.query(
                'INSERT INTO offer_walls (name, logo, bonus, unlock_requirement, is_locked) VALUES ($1, $2, $3, $4, $5)',
                [w.name, w.logo, w.bonus, w.unlock_requirement, w.is_locked || false]
            );
        }
    }
};

// --- Routes ---

// Auth Routes
// NOTE: blockOnFailure: false ensures users can still register/login if the IP check API is down or fails
app.post('/api/auth/signup', checkIpWithIPHub({ blockImmediately: true, blockOnFailure: false }), async (req, res) => {
  const { email, username, password, referralCode } = req.body;
  // Clean IP address (remove IPv6 prefix if present)
  const rawIp = req.ip || '127.0.0.1';
  const ipAddress = rawIp.replace('::ffff:', '');

  const ipInfo = req.ipInfo || {}; // From middleware
  
  // Basic IP History entry
  const ipHistoryEntry = {
      ip: ipAddress,
      lastSeen: new Date().toISOString(),
      isp: ipInfo.isp || ipInfo.org || 'Unknown',
      country: ipInfo.countryName || 'Unknown',
      isBlocked: req.isBlocked || false,
      blockType: req.isBlocked ? (ipInfo.block === 1 ? 'VPN/Proxy' : ipInfo.block === 2 ? 'Data Center' : 'Suspicious') : null
  };

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const earnId = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await pool.query(
      'INSERT INTO users (email, username, password_hash, earn_id, balance, ip_address, country, ip_history) VALUES ($1, $2, $3, $4, 0, $5, $6, $7) RETURNING id, email, username, earn_id, balance, ip_history',
      [email, username, hashedPassword, earnId, ipAddress, ipInfo.countryName, JSON.stringify([ipHistoryEntry])]
    );

    const user = snakeToCamel(newUser.rows[0]);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', checkIpWithIPHub({ blockImmediately: true, blockOnFailure: false }), async (req, res) => {
  const { email, password } = req.body;
  const rawIp = req.ip || '127.0.0.1';
  const ipAddress = rawIp.replace('::ffff:', '');
  const ipInfo = req.ipInfo || {};

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // IP History Update
    let ipHistory = user.ip_history || [];
    
    const ipHistoryEntry = {
        ip: ipAddress,
        lastSeen: new Date().toISOString(),
        isp: ipInfo.isp || ipInfo.org || 'Unknown',
        country: ipInfo.countryName || 'Unknown',
        isBlocked: req.isBlocked || false,
        blockType: req.isBlocked ? (ipInfo.block === 1 ? 'VPN/Proxy' : ipInfo.block === 2 ? 'Data Center' : 'Suspicious') : null
    };

    // Check if IP already exists in history
    const existingIndex = ipHistory.findIndex(entry => entry.ip === ipAddress);
    if (existingIndex > -1) {
        // Update existing entry
        ipHistory[existingIndex] = { ...ipHistory[existingIndex], ...ipHistoryEntry };
    } else {
        // Add new entry
        ipHistory.push(ipHistoryEntry);
    }
    
    // Limit history size if needed (e.g., last 20 IPs)
    if (ipHistory.length > 20) ipHistory = ipHistory.slice(-20);

    // Update User in DB
    await pool.query(
        'UPDATE users SET ip_address = $1, country = $2, ip_history = $3 WHERE id = $4',
        [ipAddress, ipInfo.countryName, JSON.stringify(ipHistory), user.id]
    );

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: snakeToCamel({ ...user, ip_history: ipHistory }) }); // Send updated user back
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    // Hardcoded admin for demo
    if (email === 'raihansarker270@gmail.com' && password === 'Wh1@Wh1@') {
        const token = jwt.sign({ id: 1, role: 'admin', username: 'Admin' }, JWT_SECRET);
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid admin credentials' });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.sendStatus(404);
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.patch('/api/user/profile', authenticateToken, async (req, res) => {
    const { username, avatarUrl } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET username = COALESCE($1, username), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING *',
            [username, avatarUrl, req.user.id]
        );
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server error' });
    }
});

// Public Data Routes
app.get('/api/survey-providers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM survey_providers ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching surveys' });
    }
});

app.get('/api/offer-walls', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM offer_walls ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offer walls' });
    }
});

app.get('/api/payment-methods', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_methods WHERE is_enabled = true ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment methods' });
    }
});

app.get('/api/public/earning-feed', async (req, res) => {
    try {
        // Fetch real transactions (Tasks, Withdrawals, etc.) from DB
        // Using COALESCE for provider to ensure it's a string
        const query = `
            SELECT t.id, u.username as user, u.avatar_url as avatar, 
                   CASE WHEN t.type = 'Withdrawal' THEN 'Withdrawal' ELSE t.method END as task,
                   COALESCE(t.source, '') as provider, 
                   t.amount
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            ORDER BY t.date DESC
            LIMIT 20
        `;
        const result = await pool.query(query);

        const feedData = result.rows.map(row => ({
            id: row.id,
            user: row.user,
            avatar: row.avatar || `https://i.pravatar.cc/32?u=${row.user}`,
            task: row.task,
            provider: row.provider,
            amount: parseFloat(row.amount)
        }));
        
        res.json(feedData);
    } catch (error) {
        console.error('Error fetching public earning feed:', error);
        res.json([]); // Return empty array on error to prevent crash
    }
});

app.get('/api/leaderboard', async (req, res) => {
    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, user: 'CryptoKing', avatar: 'https://i.pravatar.cc/32?u=cryptoking', earned: 1450.75, level: 98 },
        { rank: 2, user: 'Sparkb6', avatar: 'https://i.pravatar.cc/32?u=sparkb6', earned: 1230.50, level: 92 },
        { rank: 3, user: 'GamerX', avatar: 'https://i.pravatar.cc/32?u=gamerx', earned: 1100.00, level: 89 },
    ];
    res.json(leaderboard);
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [req.user.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

app.post('/api/notifications/read', authenticateToken, async (req, res) => {
     try {
        await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

// Transaction Routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

app.post('/api/transactions/withdraw', authenticateToken, async (req, res) => {
    const { id, type, method, amount, status } = req.body;
    try {
        // Check balance
        const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
        const currentBalance = parseFloat(userRes.rows[0].balance);
        
        if (currentBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct balance
        await pool.query('UPDATE users SET balance = balance - $1, total_withdrawn = total_withdrawn + $1 WHERE id = $2', [amount, req.user.id]);

        // Create transaction
        const result = await pool.query(
            'INSERT INTO transactions (id, user_id, type, method, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, req.user.id, type, method, amount, status]
        );
        res.status(201).json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing withdrawal' });
    }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/stats', adminAuthMiddleware, async (req, res) => {
    try {
        const totalUsersRes = await pool.query('SELECT COUNT(*) FROM users');
        const pendingWithdrawalsRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE status = 'Pending' AND type = 'Withdrawal'");
        const totalPaidOutRes = await pool.query("SELECT SUM(amount) FROM transactions WHERE status = 'Completed' AND type = 'Withdrawal'");
        
        // Real queries for dashboard stats
        const newUsersRes = await pool.query("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'");
        const tasksAllRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Task Reward' OR source IN ('Task', 'Survey', 'Offer')");
        const tasks30Res = await pool.query("SELECT COUNT(*) FROM transactions WHERE (type = 'Task Reward' OR source IN ('Task', 'Survey', 'Offer')) AND date > NOW() - INTERVAL '30 days'");

        res.json({
            totalUsers: parseInt(totalUsersRes.rows[0].count),
            pendingWithdrawals: parseInt(pendingWithdrawalsRes.rows[0].count),
            totalPaidOut: parseFloat(totalPaidOutRes.rows[0].sum || 0),
            newUsersLast30Days: parseInt(newUsersRes.rows[0].count),
            tasksCompletedAllTime: parseInt(tasksAllRes.rows[0].count),
            tasksCompletedLast30Days: parseInt(tasks30Res.rows[0].count)
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: 'Error' });
    }
});

app.get('/api/admin/recent-tasks', adminAuthMiddleware, async (req, res) => {
     try {
         // Fetch recent "Task" type transactions
         const result = await pool.query(`
            SELECT t.id as "transactionId", t.date, u.email, t.amount, u.id as "userId"
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'Task Reward' OR t.source IN ('Task', 'Survey', 'Offer')
            ORDER BY t.date DESC
            LIMIT 5
         `);
         
         if (result.rows.length > 0) {
            return res.json(result.rows);
         }

         // Fallback Mock if DB empty
         res.json([
             { transactionId: 'T123', date: new Date(), email: 'user@example.com', amount: 2.50, userId: 1 },
             { transactionId: 'T124', date: new Date(), email: 'test@test.com', amount: 1.20, userId: 2 },
         ]);
     } catch (error) {
         res.status(500).json({ message: 'Error fetching recent tasks' });
     }
});

app.get('/api/admin/recent-signups', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, created_at as "joinedDate" FROM users ORDER BY created_at DESC LIMIT 5');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

app.get('/api/admin/users', adminAuthMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        let query = 'SELECT * FROM users';
        let countQuery = 'SELECT COUNT(*) FROM users';
        let params = [];

        if (search) {
            query += ' WHERE username ILIKE $1 OR email ILIKE $1';
            countQuery += ' WHERE username ILIKE $1 OR email ILIKE $1';
            params.push(`%${search}%`);
        }

        query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

        const result = await pool.query(query, params);
        const countResult = await pool.query(countQuery, params);
        const totalUsers = parseInt(countResult.rows[0].count);

        res.json({
            users: result.rows.map(snakeToCamel),
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/admin/users/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({message: 'User not found'});
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

app.get('/api/admin/users/:id/transactions', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.params.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

app.get('/api/admin/transactions', adminAuthMiddleware, async (req, res) => {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const offset = (page - 1) * limit;
    
    try {
        const result = await pool.query(`
            SELECT t.*, u.email, u.id as user_id 
            FROM transactions t 
            LEFT JOIN users u ON t.user_id = u.id 
            WHERE t.type = 'Withdrawal' 
            ORDER BY t.date DESC 
            LIMIT $1 OFFSET $2`, [limit, offset]);
            
        const countResult = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Withdrawal'");
        
        res.json({
            transactions: result.rows.map(snakeToCamel),
            currentPage: page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.patch('/api/admin/transactions/:id', adminAuthMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
        
        // If rejected, refund balance
        if (status === 'Rejected') {
             const tx = result.rows[0];
             if (tx.type === 'Withdrawal') {
                 await pool.query('UPDATE users SET balance = balance + $1, total_withdrawn = total_withdrawn - $1 WHERE id = $2', [tx.amount, tx.user_id]);
             }
        }
        
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction' });
    }
});

// Admin Payment Methods
app.get('/api/admin/payment-methods', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_methods ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.patch('/api/admin/payment-methods/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled } = req.body;
    try {
        const result = await pool.query(
            'UPDATE payment_methods SET is_enabled = $1 WHERE id = $2 RETURNING *',
            [isEnabled, id]
        );
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Survey Provider Management
app.get('/api/admin/survey-providers', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM survey_providers ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching survey providers for admin:', error);
        res.status(500).json({ message: 'Server error fetching survey providers.' });
    }
});

app.patch('/api/admin/survey-providers/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled, logo, name } = req.body;
    
    try {
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (typeof isEnabled === 'boolean') {
            fields.push(`is_enabled = $${queryIndex++}`);
            values.push(isEnabled);
        }
        if (logo) {
            fields.push(`logo = $${queryIndex++}`);
            values.push(logo);
        }
        if (name) {
            fields.push(`name = $${queryIndex++}`);
            values.push(name);
        }

        if (fields.length === 0) {
             return res.status(400).json({ message: 'No fields to update.' });
        }

        values.push(id);
        const query = `UPDATE survey_providers SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Survey provider not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating survey provider:', error);
        res.status(500).json({ message: 'Server error updating survey provider.' });
    }
});

// Admin Offer Wall Management
app.get('/api/admin/offer-walls', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM offer_walls ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (error) {
        console.error('Error fetching offer walls for admin:', error);
        res.status(500).json({ message: 'Server error fetching offer walls.' });
    }
});

app.patch('/api/admin/offer-walls/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { isEnabled, logo, name } = req.body;
    
    try {
        const fields = [];
        const values = [];
        let queryIndex = 1;

        if (typeof isEnabled === 'boolean') {
            fields.push(`is_enabled = $${queryIndex++}`);
            values.push(isEnabled);
        }
        if (logo) {
            fields.push(`logo = $${queryIndex++}`);
            values.push(logo);
        }
        if (name) {
            fields.push(`name = $${queryIndex++}`);
            values.push(name);
        }

        if (fields.length === 0) {
             return res.status(400).json({ message: 'No fields to update.' });
        }

        values.push(id);
        const query = `UPDATE offer_walls SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Offer wall not found.' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (error) {
        console.error('Error updating offer wall:', error);
        res.status(500).json({ message: 'Server error updating offer wall.' });
    }
});

// Start Server
initDb().then(() => {
  seedPaymentMethods();
  seedSurveyProviders();
  seedOfferWalls();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
