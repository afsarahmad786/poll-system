const pollService = require("../services/pollService");
const { send } = require("../kafka/producer");
const { broadcastNewPoll } = require("../websockets/websocket");

const voteOnPoll = async (req, res) => {
  const { id } = req.params;  // poll_id
  const { option_id, email } = req.body;  // user sends option_id and email
  console.log(option_id, email, id);

  try {
    console.log('start controller');

    // Call the service layer to handle the voting process
    const vote = await pollService.voteOnPoll(id, option_id, email);

    return res.status(201).json({ message: 'Vote recorded successfully', vote });
  } catch (error) {
    if (error.message === 'Poll not found') {
      return res.status(404).json({ message: 'Poll not found' });
    } else if (error.message === 'You have already voted on this poll') {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    } else if (error.message === 'Invalid option selected for this poll') {
      return res.status(400).json({ message: 'Invalid option selected for this poll' });
    } else {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
};

const createPoll = async (req, res) => {
  try {
    const { title, options } = req.body;

    if (!title || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Poll needs a title and at least two options" });
    }

    // Create poll and options
    const poll = await pollService.createPollWithOptions(title, options);

    // Construct the message payload with relevant poll data
    const pollData = {
      poll_id: poll.poll_id,
      title: poll.title,
      options, // Include the options in the Kafka message
      created_at: poll.created_at,
    };

    // Send message to Kafka
    send('polls', { action: 'POLL_CREATED', poll: pollData });

    // Broadcast poll creation via WebSocket
    broadcastNewPoll(poll);

    return res.status(201).json(poll);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getPollResults = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await pollService.getPollResults(id);

    const results = poll.options.map(option => ({
      option_id: option.option_id,
      option_text: option.option_text,
      vote_count: option.dataValues.vote_count  // Access vote count directly from query
    }));

    return res.status(200).json({
      poll_id: poll.poll_id,
      title: poll.title,
      results
    });
  } catch (error) {
    if (error.message === 'Poll not found') {
      return res.status(404).json({ message: 'Poll not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await pollService.getLeaderboard();

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createPoll,
  voteOnPoll,
  getPollResults,
  getLeaderboard
};
