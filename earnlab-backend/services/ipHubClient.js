// services/ipHubClient.js
const logger = require('../utils/logger');

const IPHUB_API_KEY = process.env.IPHUB_API_KEY;

async function getIpInfo(ip) {
  if (!IPHUB_API_KEY) {
    logger.warn("IPHUB_API_KEY environment variable not set. Skipping IP check.");
    return null;
  }
  
  const url = `https://v2.api.iphub.info/ip/${ip}`;
  const headers = {
    'X-Key': IPHUB_API_KEY,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`IPHub API request failed for IP ${ip} with status ${response.status}.`, errorBody);
      return null;
    }
    return await response.json();
  } catch (error) {
    logger.error(`Network error calling IPHub API for IP ${ip}.`, error);
    return null;
  }
}

module.exports = { getIpInfo };
