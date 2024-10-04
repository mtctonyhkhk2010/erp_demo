const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('erp_demo', 'root', 'Touch1234', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = { sequelize };