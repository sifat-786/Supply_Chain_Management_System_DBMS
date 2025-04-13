const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  MinStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
      key: 'SupplierID'
    }
  }
});

module.exports = Product; 