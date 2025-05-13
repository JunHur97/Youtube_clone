const router = require('express').Router();

const similarityController = require('../controllers/similarityController');

router.get('/', similarityController.readAll);

module.exports = router;