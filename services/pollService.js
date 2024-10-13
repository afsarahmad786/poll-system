const { Poll, Option } = require('../models');

const createPollWithOptions = async (title, options) => {
  // Create poll first
  const poll = await Poll.create({ title });

  // Prepare options with poll_id
  const pollOptions = options.map(optionText => ({
    option_text: optionText,
    poll_id: poll.poll_id,
  }));

  // Bulk create options for the poll
  await Option.bulkCreate(pollOptions);

  // Return the poll along with the newly created options
  const createdPoll = await Poll.findOne({
    where: { poll_id: poll.poll_id },
    include: [{ model: Option, as: 'options' }],
  });

  return createdPoll;
};

module.exports = {
  createPollWithOptions,
};
