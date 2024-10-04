const {Customer, Company} = require('../models');
const {Op} = require("sequelize");

exports.getCustomers = async (req, res) => {
    try {
        const {Op} = require("sequelize");
        const customers = req.query.query ? await Customer.findAll({
            include: Company,
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: `%${req.query.query}%`,
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: `%${req.query.query}%`,
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${req.query.query}%`,
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${req.query.query}%`,
                        }
                    },
                ],
            }
        }) : await Customer.findAll({include: Company});
        res.json(customers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.addCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
        const linkCompanies = await Company.findAll({
            where: {
                id: req.body.companies_id,
            }
        })
        newCustomer.setCompanies(linkCompanies);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getCustomer = async (req, res) => {
    try {
        let customer = await Customer.findByPk(req.params.id, {
            include: Company,
        });
        let temp_companies_id = [];
        customer.Companies.map((companies) => {
            temp_companies_id.push(companies.id);
        });
        customer = customer.toJSON();
        customer.companies_id = temp_companies_id;
        res.json(customer);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const [updated] = await Customer.update(req.body, {
            where: {id: req.params.id}
        });

        if (updated) {
            const updatedCustomer = await Customer.findByPk(req.params.id);
            const linkCompanies = await Company.findAll({
                where: {
                    id: req.body.companies_id,
                }
            })
            updatedCustomer.setCompanies(linkCompanies);
            res.json(updatedCustomer);
        } else {
            res.status(404).json({message: 'Customer not found'});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deleted = await Customer.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            res.json({message: 'Customer deleted'});
        } else {
            res.status(404).json({message: 'Customer not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};