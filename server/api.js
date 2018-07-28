const express = require('express');

const router = express.Router();
router.use(express.json());
router.use(require('nocache')());

const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

module.exports = router;
