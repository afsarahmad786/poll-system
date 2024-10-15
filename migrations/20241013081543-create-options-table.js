'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('options', {
      option_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      option_text: {
        type: Sequelize.STRING,
        allowNull: false
      },
      poll_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'polls',
          key: 'poll_id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      vote_count: { // New Field
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('options');
  }
};
