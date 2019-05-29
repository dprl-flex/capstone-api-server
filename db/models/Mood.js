const db = require('../db');
const { Sequelize } = db;

const Mood = db.define(
  'mood',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Mood must be named.'
        }
      }
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    hooks: {
      beforeCreate: function(mood) {
        return Mood.findOne({
          where: { userId: mood.userId, active: true }
        }).then(foundMood => {
          if (foundMood) {
            foundMood.update({ active: false });
          }
        });
      }
    }
  }
);

module.exports = Mood;
