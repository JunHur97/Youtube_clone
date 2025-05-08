const router = require('express').Router();

const distanceController = require('../controllers/distanceController');

router.get('/', distanceController.readAll);

module.exports = router;