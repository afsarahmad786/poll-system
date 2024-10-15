const { Poll, Option, Vote } = require("../models");
const { send } = require("../kafka/producer");
const Sequelize = require("sequelize");
const { broadcastLeaderboardUpdate } = require("../websockets/websocket");
const { sequelize } = require('../models');  // Ensure you import the sequelize instance

const createPollWithOptions = async (title, options) => {
  // Create poll first
  const poll = await Poll.create({ title });

  // Prepare options with poll_id
  const pollOptions = options.map((optionText) => ({
    option_text: optionText,
    poll_id: poll.poll_id,
  }));

  // Bulk create options for the poll
  await Option.bulkCreate(pollOptions);

  // Return the poll along with the newly created options
  const createdPoll = await Poll.findOne({
    where: { poll_id: poll.poll_id },
    include: [{ model: Option, as: "options" }],
  });

  return createdPoll;
};

// New function for voting on a poll

const voteOnPoll = async (id, option_id, email) => {
  console.log("service layer start");

  try {
    // Check if poll exists
    const poll = await Poll.findByPk(id, {
      include: [{ model: Option, as: "options" }],
    });
    if (!poll) {
      throw new Error("Poll not found");
    }

    // Validate if the selected option belongs to the poll
    const option = poll.options.find((opt) => opt.option_id === option_id);
    if (!option) {
      throw new Error("Invalid option selected for this poll");
    }

    // Check if the user has already voted
    const existingVote = await Vote.findOne({ where: { poll_id: id, email } });
    if (existingVote) {
      throw new Error("You have already voted on this poll");
    }

    // Record the vote and increment the vote_count
    const vote = await Vote.create({ email, poll_id: id, option_id });

    // Increment vote_count and save the updated option
    option.vote_count += 1;
    await option.save();

    // Send the vote to Kafka
    const voteData = {
      poll_id: id,
      option_id: option_id,
      email: email,
      vote_time: new Date(),
    };
    send("votes", { action: "VOTE_CAST", vote: voteData });

    // Update leaderboard and broadcast new ranking
    const leaderboard = await getLeaderboard();
    broadcastLeaderboardUpdate(leaderboard);

    return vote; // Return vote instead of response object
  } catch (error) {
    console.error("Error in voteOnPoll:", error.message); // Log the actual error
    throw error; // Re-throw the error so it can be handled in the controller
  }
};

// Get poll results
const getPollResults = async (pollId) => {
  const poll = await Poll.findByPk(pollId, {
    include: [
      {
        model: Option,
        as: "options",
        attributes: [
          "option_id",
          "option_text",
          [
            Sequelize.fn("COUNT", Sequelize.col("options->votes.vote_id")),
            "vote_count",
          ],
          
        ],
        include: [
          {
            model: Vote,
            as: "votes",
            attributes: [],
          },
        ],
      },
    ],
    group: ["Poll.poll_id", "options.option_id"],
    order: [[Sequelize.fn("COUNT", Sequelize.col("options->votes.vote_id")), "DESC"]], // Order by vote_count descending
  });

  if (!poll) {
    throw new Error("Poll not found");
  }

  return poll;
};

// Leaderboard function to get top poll options by vote count

const getLeaderboard = async () => {
  try {
    // Use Sequelize's findAll method to get the top 10 options by vote_count
    const leaderboardData = await Option.findAll({
      attributes: ['option_id', 'option_text', 'poll_id', 'vote_count'], // Specify the attributes to retrieve
      order: [['vote_count', 'DESC']], // Order by vote_count in descending order
      limit: 10, // Limit the results to 10
    });

    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  createPollWithOptions,
  voteOnPoll,
  getPollResults,
  getLeaderboard,
};
