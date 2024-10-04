const express = require('express');
const router = express.Router();
const { 
  getCustomers, 
  addCustomer, 
  getCustomer,
  updateCustomer, 
  deleteCustomer 
} = require('../controllers/customerController');

router.get('/', getCustomers);
router.post('/', addCustomer);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;