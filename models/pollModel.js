'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    poll_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    timestamps: false,
    tableName: 'polls',
  });

  Poll.associate = function(models) {
    Poll.hasMany(models.Option, { foreignKey: 'poll_id', as: 'options' });
  };

  return Poll;
};
