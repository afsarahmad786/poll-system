const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });  // Ensure the Kafka host is correctly specified
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is ready');
});

producer.on('error', (err) => {
  console.error('Error in Kafka Producer:', err);
});

const send = (topic, message) => {
  const payloads = [
    {
      topic: topic,
      messages: JSON.stringify(message), // Ensure the message is correctly formatted
      partition: 0,
    },
  ];

  console.log('Sending message to Kafka:', message); // Log the actual message payload

  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending message to Kafka:', err);
    } else {
      console.log('Message sent to Kafka:', data); // Log Kafka response data
    }
  });
};

module.exports = { send };
