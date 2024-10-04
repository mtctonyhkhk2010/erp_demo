const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const companyRoutes = require('./routes/companyRoutes');
const shopifyRoutes = require('./routes/shopifyRoutes');
const { sequelize } = require('./config/database');
const { Customer, Company } = require('./models');
const cron = require('node-cron')
const {syncCustomers} = require("./controllers/shopifyController");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/shopify', shopifyRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

cron.schedule('0 3 * * *', syncCustomers);
