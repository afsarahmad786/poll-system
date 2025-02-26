'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files in the models directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&          // Ignore hidden files
      file !== basename &&                // Ignore this file (index.js)
      file.slice(-3) === '.js' &&         // Only consider JavaScript files
      file.indexOf('.test.js') === -1     // Ignore test files
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply associations (if defined)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);          // Apply associations defined in models
  }
});

db.sequelize = sequelize;                 // Export Sequelize instance
db.Sequelize = Sequelize;

module.exports = db;
