'use strict';
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    option_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    option_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poll_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Polls',
        key: 'poll_id'
      }
    },
    vote_count: { // New Field
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    timestamps: false,
    tableName: 'options',
  });

  Option.associate = function(models) {
    Option.belongsTo(models.Poll, { foreignKey: 'poll_id', as: 'poll' });
    Option.hasMany(models.Vote, { foreignKey: 'option_id', as: 'votes' });
  };

  return Option;
};
