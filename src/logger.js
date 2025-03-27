const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = '/opt/csye6225/app/logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [new winston.transports.File({ filename: path.join(logDir, 'app.log') })],
});

module.exports = logger;
