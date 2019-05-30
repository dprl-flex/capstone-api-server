const db = require('../db');
const { Sequelize } = db;

const Mood = db.define(
  'mood',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Mood must be between 0 and 1.',
        },
        max: {
          args: 1,
          msg: 'Mood must be between 0 and 1.',
        },
        isFloat: {
          args: true,
          msg: 'Mood must be entered as a floating point number.',
        },
      },
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    hooks: {
      beforeCreate: function(mood) {
        return Mood.findOne({
          where: { userId: mood.userId, active: true },
        }).then(foundMood => {
          if (foundMood) {
            foundMood.update({ active: false });
          }
        });
      },
    },
  }
);

module.exports = Mood;
