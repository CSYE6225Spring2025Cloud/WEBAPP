const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = require('../config/db');

const HealthCheck = sequelize.define('HealthCheck', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
  },
},{
  timestamps: false, // Disable `createdAt` and `updatedAt`
});

(async () => {
  await sequelize.sync({ alter: true }); // For Syncing the database
  console.log('Database synced!');
})();

module.exports = HealthCheck;

