'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    static associate(models) {
      Vote.belongsTo(models.Poll, {
        foreignKey: 'poll_id',
        as: 'poll',
      });

      Vote.belongsTo(models.Option, {
        foreignKey: 'option_id',
        as: 'option',
      });
    }
  }

  Vote.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Vote',
    timestamps: false,  // Disable automatic timestamps
  });

  return Vote;
};
