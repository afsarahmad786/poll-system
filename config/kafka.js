const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' }); // Change with your Kafka broker
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected');
});

producer.on('error', (err) => {
  console.error('Kafka Producer error:', err);
});

module.exports = producer;
