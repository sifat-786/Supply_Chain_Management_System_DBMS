const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  SupplierID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  }
});

module.exports = Supplier; 