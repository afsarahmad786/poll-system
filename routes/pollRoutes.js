const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/create', pollController.createPoll);

module.exports = router;
