const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  Role: {
    type: DataTypes.ENUM('manufacturer', 'consumer', 'Admin', 'Supplier', 'WarehouseManager'),
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.Password) {
        user.Password = await bcrypt.hash(user.Password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('Password')) {
        user.Password = await bcrypt.hash(user.Password, 10);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = User; 