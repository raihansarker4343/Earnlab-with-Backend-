// middleware/ipHubMiddleware.js
const { getIpInfo } = require('../services/ipHubClient');
const logger = require('../utils/logger');
const { logIpData } = require('../db');

// In-memory cache with TTL (Time To Live)
const ipCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

const checkIpWithIPHub = (options = {}) => {
  const { blockImmediately = false, blockOnFailure = false } = options;

  return async (req, res, next) => {
    // req.ip will be the real client IP if 'trust proxy' is set in Express
    const clientIp = req.ip;

    if (!clientIp) {
        logger.warn('Could not determine client IP address.');
        return next(); // or block, depending on policy
    }

    // 1. Check cache first
    const cachedEntry = ipCache.get(clientIp);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
      req.ipInfo = cachedEntry.data;
      req.isBlocked = req.ipInfo.block > 0;
      logger.info(`IP ${clientIp} served from cache. Block status: ${req.isBlocked}`);

      if (blockImmediately && req.isBlocked) {
        return res.status(403).json({ message: 'Access via VPN/Proxy is not allowed.' });
      }
      return next();
    }
    
    // 2. If not in cache, call API
    const ipInfo = await getIpInfo(clientIp);
    
    // 3. Handle API failure
    if (!ipInfo) {
      // Create a synthetic info object to represent the failure for logging
      const failureInfo = { block: -1, countryName: 'Lookup Failed' };
      logIpData(clientIp, failureInfo).catch(err => logger.error('DB logging failed (on API fail):', err));

      if (blockOnFailure) {
        logger.warn(`Blocking IP ${clientIp} due to IP lookup failure.`);
        return res.status(403).json({ message: 'Verification failed. Please try again in a few moments.' });
      } else {
        logger.warn(`Allowing IP ${clientIp} despite IP lookup failure.`);
        req.ipInfo = { ip: clientIp, ...failureInfo }; 
        req.isBlocked = false; // Fail-open
        return next();
      }
    }

    // 4. Process successful API response and log it
    logIpData(clientIp, ipInfo).catch(err => logger.error('DB logging failed (on API success):', err));
    ipCache.set(clientIp, { data: ipInfo, timestamp: Date.now() });
    logger.info(`IP ${clientIp} fetched from API. Block status: ${ipInfo.block > 0}`);

    req.ipInfo = ipInfo;
    req.isBlocked = ipInfo.block > 0;

    if (blockImmediately && req.isBlocked) {
      return res.status(403).json({ message: 'Access via VPN/Proxy is not allowed.' });
    }

    next();
  };
};

module.exports = checkIpWithIPHub;