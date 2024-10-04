const axios = require('axios');
const { Customer, Company } = require('../models');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'shopifyController' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const shopifyApiUrl = 'https://ggs-sandbox.myshopify.com/admin/api/2024-07';
const shopifyApiToken = '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';

const shopifyApi = axios.create({
    baseURL: shopifyApiUrl,
    headers: {
        'X-Shopify-Access-Token': shopifyApiToken,
        'Content-Type': 'application/json',
    },
});

exports.syncCustomers = async (req, res) => {
    try {
        const response = await shopifyApi.get('/customers.json');
        const shopifyCustomers = response.data.customers;

        let companies = [];
        for (const shopifyCustomer of shopifyCustomers) {
            for (const address of shopifyCustomer.addresses) {
                if (address.company) companies.push(address.company);
            }
        }
        //get unique companies name
        companies = companies.filter((value, index, array) => array.indexOf(value) === index);

        for (const company of companies) {
            await Company.findOrCreate({
                where: { name: company },
                defaults: {
                    name: company,
                }
            });
        }

        for (const shopifyCustomer of shopifyCustomers) {
            const [customer, createdCustomer] = await Customer.findOrCreate({
                    where: {
                        shopifyId: shopifyCustomer.id.toString(),
                    },
                    defaults: {
                        shopifyId: shopifyCustomer.id.toString(),
                        firstName: shopifyCustomer.first_name,
                        lastName: shopifyCustomer.last_name,
                        email: shopifyCustomer.email,
                        phone: shopifyCustomer.phone,
                    },
                }
            );

            if (shopifyCustomer.addresses.length > 0)
            {
                const pluck = (arr, key) => arr.map(i => i[key]);

                const companies = await Company.findAll({
                    where: {
                        name: pluck(shopifyCustomer.addresses, 'company')
                    }
                });

                for (const company of companies) {
                    await customer.addCompanies(company);
                }
            }
        }

        res.json({ message: 'Customers synced successfully' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getShopifyCustomer = async (req, res) => {
    try {
        const response = await shopifyApi.get(`/customers/546${req.params.id}.json`);

        await Customer.update({
                firstName: response.data.customer.first_name,
                lastName: response.data.customer.last_name,
                email: response.data.customer.email,
                phone: response.data.customer.phone,
            },
            {
                where: {
                    shopifyId: response.data.customer.id,
                },
            },
        );

        res.json(response.data.customer);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateShopifyCustomer = async (req, res) => {
    try {
        const body = {
            "customer": {
                "id": req.body.shopifyId,
                "first_name": req.body.firstName,
                "last_name": req.body.lastName,
                "email": req.body.email,
                "phone": req.body.phone.replace(/\s/g, ''),
                "verified_email": true,
                "addresses": req.body.Companies.map((company) => {
                    return {
                        company: company.name,
                        address1: company.address,
                        phone: company.phone,
                    }
                }),
                "send_email_welcome": false
            }
        };
        const response = await shopifyApi.put(`/customers/34543${req.params.id}.json`, body);
        res.json(response.data.customer);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.createShopifyCustomer = async (req, res) => {
    try {
        const body = {
            "customer": {
                "first_name": req.body.firstName,
                "last_name": req.body.lastName,
                "email": req.body.email,
                "phone": req.body.phone.replace(/\s/g, ''),
                "verified_email": true,
                "addresses": req.body.Companies.map((company) => {
                    return {
                        company: company.name,
                        address1: company.address,
                        phone: company.phone,
                    }
                }),
                "send_email_welcome": false
            }
        };
        const response = await shopifyApi.post('/customers.json', body);

        await Customer.update(
            { shopifyId: response.data.customer.id },
            {
                where: {
                    id: req.body.id,
                },
            },
        );

        res.status(201).json(response.data.customer);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
};