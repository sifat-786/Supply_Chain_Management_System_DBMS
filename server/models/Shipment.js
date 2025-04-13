const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Shipment = sequelize.define('Shipment', {
  ShipmentID: {
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
  TrackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Status: {
    type: DataTypes.ENUM('Preparing', 'In Transit', 'Delivered', 'Cancelled'),
    defaultValue: 'Preparing'
  },
  EstimatedDeliveryDate: {
    type: DataTypes.DATE
  },
  ActualDeliveryDate: {
    type: DataTypes.DATE
  },
  Carrier: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Shipment; 