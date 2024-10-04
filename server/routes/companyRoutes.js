const express = require('express');
const router = express.Router();
const {
    getCompanies,
    addCompany,
    getCompany,
    updateCompany,
    deleteCompany
} = require('../controllers/companyController');

router.get('/', getCompanies);
router.post('/', addCompany);
router.get('/:id', getCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;