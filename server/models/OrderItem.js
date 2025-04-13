const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  OrderItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OrderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'OrderID'
    }
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'ProductID'
    }
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  UnitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  TotalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = OrderItem; 