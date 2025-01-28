const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  timezone: '+00:00',
  logging: false,
});

module.exports = sequelize;
