const express = require('express');
const bodyParser = require('body-parser');
const pollRoutes = require('./routes/pollRoutes');
const { setupWebSocket } = require('./websockets/websocket');
const sequelize = require('./config/db'); // Sequelize setup for PostgreSQL
const kafka = require('./config/kafka'); // Kafka producer setup

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.use('/polls', pollRoutes);

// Database connection
sequelize.sync()
  .then(() => {
    console.log('Database connected');
    
    // Start server only after database connection is successful
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // WebSocket Setup
    setupWebSocket(server); // Initialize WebSocket server
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
