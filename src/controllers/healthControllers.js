const HealthCheck = require("../models")

const healthCheck = async (req, res) => {
  try {
    if (Object.keys(req.body).length) {
      return res.status(400).set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
    }
    await HealthCheck.create({});
    res.status(200).set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('X-Content-Type-Options', 'nosniff')
    .end();
  } catch (error) {
    res.status(503).set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('X-Content-Type-Options', 'nosniff')
    .end();
  }
};

const methodNotAllowed = (req, res) => {
  res.status(405).set('Cache-Control', 'no-cache, no-store, must-revalidate')
  .set('Pragma', 'no-cache')
  .set('X-Content-Type-Options', 'nosniff')
  .end();
};

module.exports = { healthCheck, methodNotAllowed };
