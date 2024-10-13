const pollService = require("../services/pollService");
const { send } = require("../kafka/producer");
const { broadcastNewPoll } = require("../websockets/websocket");

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

module.exports = {
  createPoll,
};
