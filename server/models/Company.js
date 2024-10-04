const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    website: DataTypes.STRING,
});

module.exports = Company;