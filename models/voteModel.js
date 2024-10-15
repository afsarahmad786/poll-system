'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    vote_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'one_vote_per_poll'
    },
    poll_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Polls',
        key: 'poll_id'
      },
      unique: 'one_vote_per_poll'  // ensures unique vote per user per poll
    },
    option_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Options',
        key: 'option_id'
      },
      allowNull: false
    },
  }, {
    timestamps: false,
    tableName: 'votes',
    indexes: [
      {
        unique: true,
        fields: ['email', 'poll_id']  // ensures one vote per user per poll
      }
    ]
  });

  Vote.associate = function(models) {
    Vote.belongsTo(models.Option, { foreignKey: 'option_id', as: 'option' }); // Association with Option
  };

  return Vote;
};
