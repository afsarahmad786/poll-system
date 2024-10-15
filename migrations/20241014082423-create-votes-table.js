'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('votes', {
      vote_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      poll_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'polls',
          key: 'poll_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'options',
          key: 'option_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
      // Remove the `created_at` field here
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('votes');
  }
};
