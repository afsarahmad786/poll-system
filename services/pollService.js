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
  // Correct the parameters here
  console.log("service layer start");

  try {
    // Check if poll exists
    const poll = await Poll.findByPk(id, {
      include: [{ model: Option, as: "options" }],
    });
    if (!poll) {
      throw new Error("Poll not found"); // Throw the error instead of returning response object
    }
    console.log("service layer mid");

    // Check if the option_id is valid and belongs to the poll
    const validOption = poll.options.some(
      (option) => option.option_id === option_id
    );
    if (!validOption) {
      throw new Error("Invalid option selected for this poll"); // Throw the error for invalid option
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ where: { poll_id: id, email } });
    if (existingVote) {
      throw new Error("You have already voted on this poll"); // Throw error if already voted
    }

    // Record the user's vote
    const vote = await Vote.create({
      email,
      poll_id: id,
      option_id,
    });

    // Send the vote to Kafka
    const voteData = {
      poll_id: id,
      option_id: option_id,
      email: email,
      vote_time: new Date(),
    };
    send("votes", { action: "VOTE_CAST", vote: voteData });
    console.log("service layer end");

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
  });

  if (!poll) {
    throw new Error("Poll not found");
  }

  return poll;
};

// Leaderboard function to get top poll options by vote count

const getLeaderboard = async () => {
  try {
    const [leaderboardData, metadata] = await sequelize.query(`
      SELECT "Option"."option_id", "Option"."option_text","Option"."poll_id", COUNT("votes"."vote_id") AS "vote_count"
      FROM "options" AS "Option"
      LEFT OUTER JOIN "votes" AS "votes"
      ON "Option"."option_id" = "votes"."option_id"
      GROUP BY "Option"."option_id"
      ORDER BY "vote_count" DESC
      LIMIT 10;
    `);

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
