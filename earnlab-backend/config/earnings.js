// earnlab-backend/config/earnings.js
const USER_PAYOUT_RATIO = 0.7;    // user 70%, তুমি 30%
const MIN_POSTBACK_AMOUNT = 0.01;
const POSTBACK_SECRET = process.env.POSTBACK_SECRET || '';

function parseUsdAmount(raw) {
  const n = parseFloat(raw);
  if (Number.isNaN(n) || !Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function toMoney(n) {
  return Math.round(n * 100) / 100;
}

module.exports = {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  POSTBACK_SECRET,
  parseUsdAmount,
  toMoney,
};
