const express = require('express');
const router = express.Router();
const { 
  syncCustomers, 
  getShopifyCustomer, 
  updateShopifyCustomer, 
  createShopifyCustomer 
} = require('../controllers/shopifyController');

router.get('/sync', syncCustomers);
router.get('/customer/:id', getShopifyCustomer);
router.put('/customer/:id', updateShopifyCustomer);
router.post('/customer', createShopifyCustomer);

module.exports = router;