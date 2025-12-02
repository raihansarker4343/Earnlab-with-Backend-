
// earnlab-backend/routes/postback/cpx.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { pool } = require('../../db');
const {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  POSTBACK_SECRET,
  parseUsdAmount,
  calculateUserReward,
} = require('../../config/earnings');


const DEFAULT_CPX_WHITELIST = [
  '188.40.3.73',
  '2a01:4f8:d0a:30ff::2',
  '157.90.97.92',
];

const LOCAL_WHITELIST = ['127.0.0.1', '::1'];

const envWhitelist = (process.env.CPX_POSTBACK_WHITELIST || '')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean);

const CPX_ALLOWED_IPS = Array.from(
  new Set([...DEFAULT_CPX_WHITELIST, ...LOCAL_WHITELIST, ...envWhitelist])
);

const normalizeIp = (ip) => {
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  return ip;
};

const isAllowedIp = (ip) => {
  const normalized = normalizeIp(ip);
  return CPX_ALLOWED_IPS.some((allowed) => normalizeIp(allowed) === normalized);
};

// Final route:  GET /api/postback/cpx
// CPX panel URL: https://api.earnello.com/api/postback/cpx?status={status}&trans_id={trans_id}&user_id={user_id}&sub_id={subid}&sub_id_2={subid_2}&amount_local={amount_local}&amount_usd={amount_usd}&offer_id={offer_id}&hash={secure_hash}&ip_click={ip_click}&type={type}
// - Accepts status=1/2 or completed/canceled; type=bonus|out is treated as bonus.
// - If POSTBACK_SECRET is set in .env, the backend validates hash = md5({trans_id}-{POSTBACK_SECRET}) or the plain "secret" query.

router.get('/cpx', async (req, res) => {
  // -------------------------
  // 1) IP security
  // -------------------------
  const remoteIp = normalizeIp(req.ip);
  if (CPX_ALLOWED_IPS.length && !isAllowedIp(remoteIp)) {
    return res.status(403).send('FORBIDDEN_IP');
  }

 // 2) Read core fields
  const userId =
   req.query.user_id ||
    req.query.uid ||
    req.query.subid ||
    req.query.sub_id ||
    req.query.sub_id_1;

  const externalTx =
    req.query.trans_id ||
    req.query.tx_id ||
    req.query.transaction_id ||
    req.query.cid;

  const statusRaw = String(req.query.status || '').toLowerCase();
  const typeRaw = String(req.query.type || '').toLowerCase();

  const rawAmount =
    req.query.amount_usd ||
    req.query.amount_local ||
    req.query.amount ||
    req.query.payout ||
    '0';

  if (!userId || !externalTx) {
    return res.status(400).send('MISSING_USER_OR_TX');
  }

  // 3) Security
  // -------------------------
  if (POSTBACK_SECRET) {
    const fromSecret = String(req.query.secret || '');
    const fromHash = String(req.query.hash || req.query.secure_hash || '');

    const expectedHash = crypto
      .createHash('md5')
      .update(`${externalTx}-${POSTBACK_SECRET}`)
      .digest('hex');

    const okSecret = fromSecret && fromSecret === POSTBACK_SECRET;
    const okHash = fromHash && fromHash === expectedHash;

    if (!okSecret && !okHash) {
      return res.status(403).send('INVALID_SECRET');
    }
  }

  // 4) Amount validation
  // -------------------------
  const amt = parseUsdAmount(rawAmount);
  if (!amt || amt < MIN_POSTBACK_AMOUNT) {
    return res.status(400).send('INVALID_AMOUNT');
  }

   // 5) Status normalization

  let status;
  if (
    statusRaw === '1' ||
    statusRaw === 'completed' ||
    statusRaw === 'approved'
  ) {
    status = 'approved';
  } else if (
    statusRaw === '2' ||
    statusRaw === 'canceled' ||
    statusRaw === 'cancelled' ||
    statusRaw === 'reversed' ||
    statusRaw === 'chargeback'
  ) {
    status = 'reversed';
  } else {
    return res.status(400).send('INVALID_STATUS');
  }
  // 6) Bonus flag
// -------------------------
  const isBonus = typeRaw === 'bonus' || typeRaw === 'out';

  // CPX transaction id namespace
  const txId = `CPX_${externalTx}`;

  const client = await pool.connect();

  try {
   // 7) Duplicate / idempotency
    const existing = await client.query(
      'SELECT id FROM transactions WHERE id = $1',
      [txId]
    );
    if (existing.rows.length > 0) {
      return res.status(200).send('ALREADY_HANDLED');
    }

    //8) User existence check
    const userResult = await client.query(
      'SELECT id, balance, total_earned FROM users WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).send('USER_NOT_FOUND');
    }

    const user = userResult.rows[0];
    //apply bonus factor when needed
    const userReward = calculateUserReward(amt, { isBonus });

    // Decide transaction metadata based on bonus
    const method = isBonus ? 'survey_bonus' : 'survey';
    const source = 'CPX';
    const offerId = req.query.offer_id || null;
    const ipClick = req.query.ip_click || null;

    // -------------------------
    // 9) Apply status
    // -------------------------
    if (status === 'approved') {
      await client.query('BEGIN');

      await client.query(
        'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
        [userReward, user.id]
      );

      await client.query(
        `INSERT INTO transactions
          (id, user_id, type, method, amount, status, date, source, meta)
         VALUES
          ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)`,
        [
          txId,
          user.id,
          isBonus ? 'bonus_earn' : 'earn',
          method,
          userReward,
          'completed',
          source,
          JSON.stringify({
            is_bonus: isBonus,
            offer_id: offerId,
            ip_click: ipClick,
            raw_status: statusRaw,
            raw_type: typeRaw,
            amount_usd: req.query.amount_usd || null,
            amount_local: req.query.amount_local || null,
          }),
        ]
      );

      await client.query('COMMIT');
      return res.status(200).send('OK');
    }

    if (status === 'reversed') {
      await client.query('BEGIN');

      await client.query(
        'UPDATE users SET balance = GREATEST(balance - $1, 0) WHERE id = $2',
        [userReward, user.id]
      );

      await client.query(
        `INSERT INTO transactions
          (id, user_id, type, method, amount, status, date, source, meta)
         VALUES
          ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)`,
        [
          txId,
          user.id,
          isBonus ? 'bonus_reversal' : 'reversal',
          method,
          -userReward,
          'reversed',
          source,
          JSON.stringify({
            is_bonus: isBonus,
            offer_id: offerId,
            ip_click: ipClick,
            raw_status: statusRaw,
            raw_type: typeRaw,
            amount_usd: req.query.amount_usd || null,
            amount_local: req.query.amount_local || null,
          }),
        ]
      );

      await client.query('COMMIT');
      return res.status(200).send('REVERSED');
    }

    return res.status(400).send('INVALID_STATUS');

  } catch (err) {
    console.error('CPX postback error', err);
    try {
      await client.query('ROLLBACK');
    } catch (e) {}
    return res.status(500).send('SERVER_ERROR');
  } finally {
    client.release();
  }
});

module.exports = router;
