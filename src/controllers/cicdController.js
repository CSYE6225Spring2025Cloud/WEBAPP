/* const { HealthCheck } = require("../models");
const logger = require("../logger");
const StatsD = require('statsd-client');
const statsd = new StatsD({ host: 'localhost', port: 8125, prefix: 'webapp' });

const cicdCheck = async (req, res) => {
  const start = Date.now();
  statsd.increment('api.cicd.count');

  try {
    logger.info("GET /cicd - cicdCheck called");

    if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
      logger.warn("cicdCheck - Unexpected body in request");
      return res.status(400)
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('X-Content-Type-Options', 'nosniff')
        .end();
    }

    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
      logger.warn("cicdCheck - Unexpected query or path parameters");
      return res.status(400)
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
        .set('X-Content-Type-Options', 'nosniff')
        .end();
    }

    const dbStart = Date.now();
    await HealthCheck.create({});
    const dbDuration = Date.now() - dbStart;
    logger.info(`cicdCheck - DB Insert Time: ${dbDuration}ms`);
    statsd.timing('db.cicd.insert.duration', dbDuration);

    res.status(200)
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
  } catch (error) {
    logger.error(`cicdCheck Error: ${error.message}\n${error.stack}`);
    res.status(503)
      .set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
  } finally {
    const totalDuration = Date.now() - start;
    logger.info(`cicdCheck Total Time: ${totalDuration}ms`);
    statsd.timing('api.cicd.total.duration', totalDuration);
  }
};

const methodNotAllowed = (req, res) => {
  logger.warn(`405 Method Not Allowed - ${req.method} on /cicd`);
  res.status(405)
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('X-Content-Type-Options', 'nosniff')
    .end();
};

module.exports = { cicdCheck, methodNotAllowed };
 */