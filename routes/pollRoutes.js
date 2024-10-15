const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/create', pollController.createPoll);
router.post('/:id/vote', pollController.voteOnPoll);
// New route for retrieving poll results
router.get('/:id/results', pollController.getPollResults);
router.get('/leaderboard', pollController.getLeaderboard);
module.exports = router;
