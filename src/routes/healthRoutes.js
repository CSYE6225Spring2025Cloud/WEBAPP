const express = require('express');
const { healthCheck, methodNotAllowed } = require('../controllers/healthControllers');

const router = express.Router();

router.get('/', healthCheck);
router.all('/', methodNotAllowed);

module.exports = router;
