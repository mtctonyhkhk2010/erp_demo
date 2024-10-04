const { Company, Customer} = require('../models');
const {Op} = require("sequelize");

exports.getCompanies = async (req, res) => {
  try {
    const {Op} = require("sequelize");
    const companies = req.query.query ? await Company.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${req.query.query}%`,
            }
          },
          {
            address: {
              [Op.like]: `%${req.query.query}%`,
            }
          },
          {
            phone: {
              [Op.like]: `%${req.query.query}%`,
            }
          },
          {
            website: {
              [Op.like]: `%${req.query.query}%`,
            }
          },
        ],
      }
    }) : await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const companies = await Company.findByPk(req.params.id);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const [updated] = await Company.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCompany = await Company.findByPk(req.params.id);
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Company deleted' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};