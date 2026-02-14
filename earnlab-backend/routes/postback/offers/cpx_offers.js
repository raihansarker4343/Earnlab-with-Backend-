
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// CPX Research surveys fetcher
router.get('/get-surveys', async (req, res) => {
    try {
        const userId = req.query.user_id;
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        const appId = process.env.VITE_CPX_APP_ID || '30320';
        const secureHash = process.env.POSTBACK_SECRET; // আপনার .env থেকে সিক্রেট
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // CPX MD5 Hash: md5(ext_user_id + "-" + secure_hash)
        const hash = crypto.createHash('md5').update(`${userId}-${secureHash}`).digest('hex');

        const url = `https://live-api.cpx-research.com/api/get-surveys.php?app_id=${appId}&ext_user_id=${userId}&output_method=api&ip_user=${userIp}&user_agent=${encodeURIComponent(userAgent)}&limit=12&secure_hash=${hash}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('CPX API Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

module.exports = router;
