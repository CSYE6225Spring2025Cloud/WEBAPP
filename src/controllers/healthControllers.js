const { HealthCheck } = require("../models");
const logger = require("../logger");
const StatsD = require('statsd-client'); // Add StatsD
const statsd = new StatsD({ host: 'localhost', port: 8125, prefix: 'webapp' }); // Initialize StatsD

const healthCheck = async (req, res) => {
  const start = Date.now(); // Track total API duration
  statsd.increment('api.healthz.count'); // Count every API hit

  try {
    logger.info("GET /healthz - healthCheck called");

    if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
      logger.warn("healthCheck - Unexpected body in request");
      return res.status(400)
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('X-Content-Type-Options', 'nosniff')
        .end();
    }

    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
      logger.warn("healthCheck - Unexpected query or path parameters");
      return res.status(400)
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('X-Content-Type-Options', 'nosniff')
        .end();
    }

    const dbStart = Date.now(); // Track DB write time
    await HealthCheck.create({});
    const dbDuration = Date.now() - dbStart;
    logger.info(`healthCheck - DB Insert Time: ${dbDuration}ms`);
    statsd.timing('db.healthz.insert.duration', dbDuration); // DB metric

    res.status(200)
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
  } catch (error) {
    logger.error(`healthCheck Error: ${error.message}\n${error.stack}`);
    res.status(503)
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
  } finally {
    const totalDuration = Date.now() - start;
    logger.info(`healthCheck Total Time: ${totalDuration}ms`);
    statsd.timing('api.healthz.total.duration', totalDuration); // Total duration metric
  }
};

const methodNotAllowed = (req, res) => {
  logger.warn(`405 Method Not Allowed - ${req.method} on /healthz`);
  res.status(405)
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('X-Content-Type-Options', 'nosniff')
    .end();
};

module.exports = { healthCheck, methodNotAllowed };
