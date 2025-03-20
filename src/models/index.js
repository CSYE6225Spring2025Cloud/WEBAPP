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

// New Model (File) for handling file uploads
const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  upload_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

// Sync all models with the database
(async () => {
  await sequelize.sync({ alter: true }); // Ensures schema updates
  console.log("Database & tables synced including File model!");
})();

// Export models
module.exports = { HealthCheck, File };
