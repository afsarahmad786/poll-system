const kafka = require('kafka-node');
const { KafkaClient, Consumer } = kafka;
const { Option } = require('../models');

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'polls', partition: 0 }],
  { autoCommit: false } // Manual offset control for reliability
);

consumer.on('message', async (message) => {
  try {
    const data = JSON.parse(message.value);

    switch (data.action) {
      case 'POLL_CREATED':
        console.log('New poll created:', data.poll);
        break;

      case 'VOTE_CAST':
        console.log('Vote cast:', data);
        await handleVoteCast(data.vote);
        break;

      default:
        console.warn('Unknown action type:', data.action);
    }
    consumer.commit(); // Manually committing the offset after processing
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

    if (!option) {
      console.error('Invalid option_id:', vote.option_id);
      return;
    }

    // Increment vote_count and save
    option.vote_count += 1;
    await option.save();
    console.log('Vote processed for option:', vote.option_id);

    // Broadcast updated vote count via WebSocket
    broadcastVoteUpdate(option.option_id, option.vote_count);
  } catch (error) {
    console.error('Error processing vote:', error);
  }
};

process.on('SIGINT', () => {
  consumer.close(true, () => {
    console.log('Kafka consumer closed');
    process.exit();
  });
});

module.exports = consumer;
