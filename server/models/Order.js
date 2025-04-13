const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  OrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OrderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending'
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
      key: 'SupplierID'
    }
  },
  Notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Order; 