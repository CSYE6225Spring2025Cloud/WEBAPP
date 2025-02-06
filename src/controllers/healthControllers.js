const HealthCheck = require("../models")

const healthCheck = async (req, res) => {
  try {
    if (req.headers['content-length'] && parseInt(req.headers['content-length'],10) > 0) 
    {
      return res.status(400).set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end(); // This is when we pass body or empty string 
    }
    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0 ) {
      return res.status(400).set('Cache-Control', 'no-cache, no-store, must-revalidate')
      .set('Pragma', 'no-cache')
      .set('X-Content-Type-Options', 'nosniff')
      .end();
    }

    await HealthCheck.create({});
    res.status(200).set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('X-Content-Type-Options', 'nosniff')
    .end(); // if there is no body pass and get method used
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
  .end(); // if we use method other than GET
};

module.exports = { healthCheck, methodNotAllowed };
