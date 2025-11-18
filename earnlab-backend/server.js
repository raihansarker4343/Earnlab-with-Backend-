
const express = require('express');
const cors = require('cors');
const { pool, initDb, logIpData } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const checkIpWithIPHub = require('./middleware/ipHubMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

// Helper to convert snake_case to camelCase
const snakeToCamel = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    
    const newObj = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelKey] = snakeToCamel(obj[key]);
    }
    return newObj;
};

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Middleware for Admin authentication
const adminAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
      req.user = decoded;
      next();
    });
};

// --- PUBLIC ROUTES ---

app.get('/api/offer-walls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM offer_walls WHERE is_enabled = true ORDER BY id');
    res.json(result.rows.map(snakeToCamel));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/survey-providers', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM survey_providers WHERE is_enabled = true ORDER BY id');
      res.json(result.rows.map(snakeToCamel));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/payment-methods', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_methods WHERE is_enabled = true ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/public/earning-feed', (req, res) => {
    // Mock data for live feed
    const feed = [
        { id: '1', user: 'Sparkb6', avatar: 'https://i.pravatar.cc/32?u=sparkb6', task: 'Bitcoin (BTC)', provider: '', amount: 141.96 },
        { id: '2', user: 'SoFi Plus', avatar: 'https://i.pravatar.cc/32?u=sofi', task: '$10 Mont...', provider: 'RevU', amount: 28.13 },
        { id: '3', user: 'Fastslots', avatar: 'https://i.pravatar.cc/32?u=fastslots', task: '[DE/AT/C...', provider: 'AdToWall', amount: 47.85 },
        { id: '4', user: 'JohnDoe', avatar: 'https://i.pravatar.cc/32?u=johndoe', task: 'Sea of Conquest: P...', provider: 'Torox', amount: 24.01 },
        { id: '5', user: 'JaneSmith', avatar: 'https://i.pravatar.cc/32?u=janesmith', task: 'BitLabs - Survey', provider: 'BitLabs', amount: 1.11 },
    ];
    res.json(feed);
});

app.get('/api/leaderboard', (req, res) => {
    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, user: 'CryptoKing', avatar: 'https://i.pravatar.cc/32?u=cryptoking', earned: 1450.75, level: 98 },
        { rank: 2, user: 'Sparkb6', avatar: 'https://i.pravatar.cc/32?u=sparkb6', earned: 1230.50, level: 92 },
        { rank: 3, user: 'GamerX', avatar: 'https://i.pravatar.cc/32?u=gamerx', earned: 1100.00, level: 89 },
        { rank: 4, user: 'SoFi Plus', avatar: 'https://i.pravatar.cc/32?u=sofi', earned: 980.25, level: 85 },
        { rank: 5, user: 'raihansarker', avatar: 'https://i.pravatar.cc/32?u=raihansarker', earned: 850.00, level: 82 },
    ];
    res.json(leaderboard);
});

// --- AUTH ROUTES ---

app.post('/api/auth/signup', checkIpWithIPHub({ blockImmediately: true }), async (req, res) => {
  const { username, email, password, referralCode } = req.body;

  // ipInfo is attached by checkIpWithIPHub middleware
  const ipInfo = req.ipInfo || {};
  // req.isBlocked comes from middleware logic
  const isBlocked = req.isBlocked || false; 
  const blockType = isBlocked ? 'VPN/Proxy' : 'Residential';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Construct the initial ip_history entry
    const initialIpHistory = [{
        ip: req.ip,
        lastSeen: new Date().toISOString(),
        isp: ipInfo.isp || ipInfo.org || 'Unknown',
        country: ipInfo.countryName || 'Unknown',
        isBlocked: isBlocked,
        blockType: blockType
    }];

    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, earn_id, ip_address, country, ip_history) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username, email, earn_id`,
      [
          username, 
          email, 
          hashedPassword, 
          Math.floor(100000 + Math.random() * 900000).toString(),
          req.ip,
          ipInfo.countryName || 'Unknown',
          JSON.stringify(initialIpHistory)
      ]
    );

    // Handle referral logic here if needed

    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({ token, user: snakeToCamel(user) });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', checkIpWithIPHub({ blockImmediately: true }), async (req, res) => {
  const { email, password } = req.body;
  
  // ipInfo is attached by middleware
  const ipInfo = req.ipInfo || {};
  const isBlocked = req.isBlocked || false;
  const blockType = isBlocked ? 'VPN/Proxy' : 'Residential';

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

    // Update IP History
    let ipHistory = user.ip_history || [];
    // Ensure it's an array if it came back as something else
    if (!Array.isArray(ipHistory)) ipHistory = [];

    // Check if this IP already exists in history
    const existingEntryIndex = ipHistory.findIndex(entry => entry.ip === req.ip);
    
    const newEntry = {
        ip: req.ip,
        lastSeen: new Date().toISOString(),
        isp: ipInfo.isp || ipInfo.org || 'Unknown',
        country: ipInfo.countryName || 'Unknown',
        isBlocked: isBlocked,
        blockType: blockType
    };

    if (existingEntryIndex >= 0) {
        // Update existing entry
        ipHistory[existingEntryIndex] = newEntry;
    } else {
        // Add new entry to the beginning
        ipHistory.unshift(newEntry);
    }
    
    // Keep only last 10 IPs to save space
    if (ipHistory.length > 10) ipHistory = ipHistory.slice(0, 10);

    await pool.query(
        'UPDATE users SET ip_history = $1, ip_address = $2 WHERE id = $3',
        [JSON.stringify(ipHistory), req.ip, user.id]
    );

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({ token, user: snakeToCamel(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, earn_id, avatar_url, created_at, total_earned, balance, last_30_days_earned, completed_tasks, total_wagered, total_profit, total_withdrawn, total_referrals, referral_earnings, xp, rank FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    // Rename fields to camelCase for frontend
    res.json(snakeToCamel(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/user/profile', authMiddleware, async (req, res) => {
    const { username, avatarUrl } = req.body;
    try {
        // Basic validation
        if (username && username.length < 3) {
             return res.status(400).json({ message: 'Username too short.' });
        }

        const result = await pool.query(
            'UPDATE users SET username = COALESCE($1, username), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, username, email, earn_id, avatar_url, created_at, total_earned, balance, xp, rank',
            [username, avatarUrl, req.user.id]
        );
        res.json(snakeToCamel(result.rows[0]));
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Username already taken.' });
        }
        res.status(500).json({ message: 'Server error updating profile.' });
    }
});

// --- USER ACTIONS ---

app.get('/api/transactions', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/transactions/withdraw', authMiddleware, async (req, res) => {
    const { id, type, method, amount, status } = req.body;
    
    // Validate balance
    try {
        const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
        const currentBalance = Number(userRes.rows[0].balance);
        
        if (amount > currentBalance) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        await pool.query('BEGIN'); // Start transaction

        // Deduct balance
        await pool.query('UPDATE users SET balance = balance - $1, total_withdrawn = total_withdrawn + $1 WHERE id = $2', [amount, req.user.id]);

        // Record transaction
        const result = await pool.query(
            'INSERT INTO transactions (id, user_id, type, method, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, req.user.id, type, method, amount, status]
        );

        await pool.query('COMMIT'); // Commit transaction

        res.json(snakeToCamel(result.rows[0]));
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Withdrawal failed.' });
    }
});

app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [req.user.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/notifications/read', authMiddleware, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// --- ADMIN ROUTES ---

app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    // Hardcoded admin credentials for demo purposes. 
    // In production, you would query an 'admins' table or check a role in the users table.
    const ADMIN_EMAIL = "raihansarker270@gmail.com";
    // In a real app, verify hash. Here simplified for demo env if seeded.
    
    if (email === ADMIN_EMAIL) {
        // Check password (assuming hardcoded check for simplicity if DB not ready)
        // Or query DB:
        try {
             const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
             if(result.rows.length > 0) {
                 const admin = result.rows[0];
                 const isMatch = await bcrypt.compare(password, admin.password_hash);
                 if(isMatch) {
                     const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET);
                     return res.json({ token });
                 }
             }
        } catch(e) {
            console.error("Admin login db error", e);
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(400).json({ message: 'Invalid credentials' });
});

app.get('/api/admin/stats', adminAuthMiddleware, async (req, res) => {
    try {
        const totalUsersRes = await pool.query('SELECT COUNT(*) FROM users');
        const newUsersRes = await pool.query("SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days'");
        const totalPaidRes = await pool.query("SELECT SUM(amount) FROM transactions WHERE type = 'Withdrawal' AND status = 'Completed'");
        const pendingRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Withdrawal' AND status = 'Pending'");

        res.json({
            totalUsers: parseInt(totalUsersRes.rows[0].count),
            newUsersLast30Days: parseInt(newUsersRes.rows[0].count),
            tasksCompletedAllTime: 15420, // Mock for now
            tasksCompletedLast30Days: 1240, // Mock for now
            totalPaidOut: Number(totalPaidRes.rows[0].sum || 0),
            pendingWithdrawals: parseInt(pendingRes.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/transactions', adminAuthMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countRes = await pool.query("SELECT COUNT(*) FROM transactions WHERE type = 'Withdrawal'");
        const total = parseInt(countRes.rows[0].count);
        const result = await pool.query(`
            SELECT t.*, u.email 
            FROM transactions t 
            JOIN users u ON t.user_id = u.id 
            WHERE t.type = 'Withdrawal' 
            ORDER BY t.date DESC 
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        
        res.json({
            transactions: result.rows.map(snakeToCamel),
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.patch('/api/admin/transactions/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        // Start transaction
        await pool.query('BEGIN');

        const txRes = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        if (txRes.rows.length === 0) {
             await pool.query('ROLLBACK');
             return res.status(404).json({ message: 'Transaction not found' });
        }
        const tx = txRes.rows[0];

        // Update status
        const result = await pool.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        
        // Logic for rejection (refund balance)
        if (status === 'Rejected' && tx.status === 'Pending') {
             await pool.query('UPDATE users SET balance = balance + $1, total_withdrawn = total_withdrawn - $1 WHERE id = $2', [tx.amount, tx.user_id]);
        }

        await pool.query('COMMIT');
        res.json(snakeToCamel(result.rows[0]));
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
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
        
        query += ' ORDER BY id DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        
        const countRes = await pool.query(countQuery, params);
        
        params.push(limit, offset);
        const result = await pool.query(query, params);

        res.json({
            users: result.rows.map(snakeToCamel),
            currentPage: page,
            totalPages: Math.ceil(parseInt(countRes.rows[0].count) / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/users/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/users/:id/transactions', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [req.params.id]);
        res.json(result.rows.map(snakeToCamel));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/recent-tasks', adminAuthMiddleware, async (req, res) => {
    // Mocking recent tasks for now as we don't have a tasks table yet
    res.json([
        { transactionId: 'T1001', date: new Date().toISOString(), email: 'user1@example.com', amount: 1.50, userId: 1 },
        { transactionId: 'T1002', date: new Date().toISOString(), email: 'user2@example.com', amount: 0.50, userId: 2 },
        { transactionId: 'T1003', date: new Date().toISOString(), email: 'user3@example.com', amount: 2.00, userId: 3 },
    ]);
});

app.get('/api/admin/recent-signups', adminAuthMiddleware, async (req, res) => {
     try {
        const result = await pool.query('SELECT id, email, created_at as "joinedDate" FROM users ORDER BY created_at DESC LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

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

app.get('/api/admin/payment-methods', adminAuthMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payment_methods ORDER BY id');
        res.json(result.rows.map(snakeToCamel));
    } catch (err) {
        console.error(err);
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
        if (result.rows.length === 0) return res.status(404).json({ message: 'Method not found' });
        res.json(snakeToCamel(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// --- SEEDING ---

const seedSurveyProviders = async () => {
    const check = await pool.query('SELECT COUNT(*) FROM survey_providers');
    if (parseInt(check.rows[0].count) > 0) return;

    const providers = [
        { name: 'BitLabs', logo: 'https://i.imgur.com/oZznueX.png', rating: 3, type: 'BitLabs' },
        { name: 'CPX Research', logo: 'https://i.imgur.com/ssL8ALh.png', rating: 3, type: 'CPX RESEARCH' },
        { name: 'Your-Surveys', logo: 'https://i.imgur.com/pLRnBU2.png', rating: 4, type: 'Your-Surveys' },
        { name: 'Pollfish', logo: 'https://i.imgur.com/OofFwSR.png', rating: 4, type: 'Pollfish' },
        { name: 'Prime Surveys', logo: 'https://i.imgur.com/0EGYRXz.png', rating: 3, type: 'Prime Surveys' },
        { name: 'inBrain', logo: 'https://i.imgur.com/p2jQpqv.png', rating: 2, type: 'inBrain' },
        { name: 'Adscend Media Surveys', logo: 'https://i.imgur.com/CM6xxOM.png', rating: 4, type: 'Adscend Media' },
        { name: 'TheoremReach', logo: 'https://i.imgur.com/yvC5YyW.png', rating: 4, type: 'TheoremReach', isLocked: true, unlockRequirement: "Level 5+" },
    ];

    for (const p of providers) {
        await pool.query(
            'INSERT INTO survey_providers (name, logo, rating, type, unlock_requirement, is_locked) VALUES ($1, $2, $3, $4, $5, $6)',
            [p.name, p.logo, p.rating, p.type, p.unlockRequirement || null, p.isLocked || false]
        );
    }
    console.log('Survey providers seeded');
};

const seedOfferWalls = async () => {
    const check = await pool.query('SELECT COUNT(*) FROM offer_walls');
    if (parseInt(check.rows[0].count) > 0) return;

    const walls = [
        { name: 'Torox', logo: 'https://i.imgur.com/zbyfSVW.png', bonus: '+20%' },
        { name: 'Adscend Media', logo: 'https://i.imgur.com/iY9g04E.png', bonus: '+50%' },
        { name: 'AdToWall', logo: 'https://i.imgur.com/x0iP1C9.png' },
        { name: 'RevU', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $2.50 to unlock', bonus: '+50%' },
        { name: 'AdGate Media', logo: 'https://i.imgur.com/Q2yG7nS.png' },
        { name: 'MyChips', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $2.50 to unlock', bonus: '+50%' },
        { name: 'MM Wall', logo: 'https://i.imgur.com/6XzWfP1.png' },
        { name: 'Aye-T Studios', logo: 'https://i.imgur.com/J3t5e6E.png' },
        { name: 'Monlix', logo: 'https://i.imgur.com/ePFr12w.png' },
        { name: 'Hang My Ads', logo: 'https://i.imgur.com/yvC5YyW.png', isLocked: true, unlockRequirement: 'Earn $1.00 to unlock' },
        { name: 'Lootably', logo: 'https://i.imgur.com/i9nO27d.png' },
        { name: 'Time Wall', logo: 'https://i.imgur.com/nJgq1t7.png' },
        { name: 'AdGem', logo: 'https://i.imgur.com/r9f5k2Z.png' },
    ];

    for (const w of walls) {
        await pool.query(
            'INSERT INTO offer_walls (name, logo, bonus, unlock_requirement, is_locked) VALUES ($1, $2, $3, $4, $5)',
            [w.name, w.logo, w.bonus || null, w.unlockRequirement || null, w.isLocked || false]
        );
    }
    console.log('Offer walls seeded');
};

const seedPaymentMethods = async () => {
    const check = await pool.query('SELECT COUNT(*) FROM payment_methods');
    if (parseInt(check.rows[0].count) > 0) return;

    const methods = [
        { name: 'PayPal', iconClass: 'fab fa-paypal', type: 'cash' },
        { name: 'VISA', iconClass: 'fab fa-cc-visa', type: 'cash' },
        { name: 'Amazon', iconClass: 'fab fa-amazon', type: 'special', specialBonus: '+5%' },
        { name: 'Walmart', iconClass: 'fas fa-store', type: 'special' },
        { name: 'Bitcoin', iconClass: 'fab fa-bitcoin', type: 'crypto' },
        { name: 'Litecoin', iconClass: 'fas fa-litecoin-sign', type: 'crypto' },
        { name: 'Apple', iconClass: 'fab fa-apple', type: 'special' },
        { name: 'Google Play', iconClass: 'fab fa-google-play', type: 'special' },
        { name: 'DoorDash', iconClass: 'fas fa-truck', type: 'special' },
        { name: 'Nike', iconClass: 'fas fa-check-double', type: 'special' },
        { name: 'Roblox', iconClass: 'fas fa-gamepad', type: 'special' },
        { name: 'Steam', iconClass: 'fab fa-steam', type: 'special' },
    ];

    for (const m of methods) {
        await pool.query(
            'INSERT INTO payment_methods (name, icon_class, type, special_bonus) VALUES ($1, $2, $3, $4)',
            [m.name, m.iconClass, m.type, m.specialBonus || null]
        );
    }
    console.log('Payment methods seeded');
}

const seedAdmin = async () => {
    const check = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(check.rows[0].count) > 0) return;
    
    const email = "raihansarker270@gmail.com";
    const password = "Wh1@Wh1@";
    const hash = await bcrypt.hash(password, 10);
    
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
    console.log("Admin seeded");
}


// Initialize DB and start server
initDb().then(async () => {
    await seedSurveyProviders();
    await seedOfferWalls();
    await seedPaymentMethods();
    await seedAdmin();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
