const Customer = require('./Customer');
const Company = require('./Company');
const { sequelize } = require('../config/database');
const {DataTypes} = require("sequelize");

const CompanyCustomers = sequelize.define('CompanyCustomers', {
    CompanyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id',
        },
    },
    CustomerId: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id',
        },
    },
});


// Define relationships
Customer.belongsToMany(Company, { through: CompanyCustomers });
Company.belongsToMany(Customer, { through: CompanyCustomers });

module.exports = {
    Customer,
    Company,
};