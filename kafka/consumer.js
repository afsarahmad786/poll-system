const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;
const { Option } = require('../models'); // Sequelize model for options

const client = new KafkaClient({ kafkaHost: 'localhost:9092' }); // Kafka Broker address

const consumer = new Consumer(
  client,
  [{ topic: 'polls', partition: 0 }], // List of topics to subscribe to
  { autoCommit: true }  // You can set autoCommit to false if you want manual offset control
);

consumer.on('message', async (message) => {
  try {
    const data = JSON.parse(message.value);

    switch (data.action) {
      case 'POLL_CREATED':
        console.log('New poll created:', data.poll);
        // Optionally process the poll, update cache, etc.
        break;

      case 'VOTE_CAST':
        console.log('Vote cast:', data);
        await handleVoteCast(data.vote); // Process the vote
        break;

      default:
        console.warn('Unknown action type:', data.action);
    }
  } catch (error) {
    console.error('Error processing Kafka message:', error);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka Consumer error:', err);
});

const handleVoteCast = async (vote) => {
  try {
    const option = await Option.findByPk(vote.option_id);
    if (option) {
      option.vote_count += 1; // Increment the vote count
      await option.save();
      console.log('Vote processed for option:', vote.option_id);
    } else {
      console.error('Option not found for vote:', vote.option_id);
    }
  } catch (error) {
    console.error('Error processing vote:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  consumer.close(true, () => {
    console.log('Kafka consumer closed');
    process.exit();
  });
});

module.exports = consumer;
