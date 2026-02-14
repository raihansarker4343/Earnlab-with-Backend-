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

        const appId = process.env.VITE_CPX_APP_ID || '30220';
        const secureHash = process.env.POSTBACK_SECRET; 

        // 🛠️ আইপি ফরম্যাট ঠিক করার চূড়ান্ত লজিক
        // Render/Cloudflare থেকে আসা আইপি থেকে ::ffff: এবং কমা আলাদা করা
        let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '1.1.1.1';
        const userIp = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');

        const userAgent = req.headers['user-agent'];

        // CPX MD5 Hash: md5(userId + "-" + secureHash)
        const hash = crypto.createHash('md5').update(`${userId}-${secureHash}`).digest('hex');

        // URL তৈরি
        const url = `https://live-api.cpx-research.com/api/get-surveys.php?app_id=${appId}&ext_user_id=${userId}&output_method=api&ip_user=${userIp}&user_agent=${encodeURIComponent(userAgent)}&limit=12&secure_hash=${hash}`;

        // লগ চেক করার জন্য (Render Logs-এ দেখা যাবে)
        console.log(`[CPX API Request] User: ${userId}, Clean IP: ${userIp}`);

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('CPX API Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

module.exports = router;
