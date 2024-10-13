const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' }); // Kafka Broker address
const consumer = new Consumer(
  client,
  [{ topic: 'polls', partition: 0 }], // List of topics to subscribe to
  { autoCommit: true }
);

consumer.on('message', async (message) => {
  const data = JSON.parse(message.value);

  switch (data.action) {
    case 'POLL_CREATED':
      console.log('New poll created:', data.poll);
      // Optionally, you can process the poll, update a cache, or trigger another service
      break;

    case 'VOTE_CAST':
      console.log('Vote cast:', data);
      // Handle the vote logic, e.g., update poll options count
      await handleVoteCast(data.vote);
      break;

    default:
      console.warn('Unknown action type:', data.action);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka Consumer error:', err);
});

const handleVoteCast = async (vote) => {
  // Business logic to update vote count
  // E.g., find poll option by id and increment its count
  try {
    // Fetch the option from DB and update the vote count
    // const option = await Option.findByPk(vote.optionId);
    // option.voteCount += 1;
    // await option.save();
    console.log('Vote processed for option:', vote.optionId);
  } catch (error) {
    console.error('Error processing vote:', error);
  }
};

module.exports = consumer;
