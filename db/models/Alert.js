const db = require('../db');
const { Sequelize } = db;

const Alert = db.define('alert', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: 'Alert field cannot be null',
      },
      notEmpty: {
        args: true,
        msg: 'Alert must have message text',
      },
    },
  },
  alertType: {
    type: Sequelize.ENUM('event', 'poll', 'user'),
    allowNull: false,
  },
  targetId: {
    type: Sequelize.UUID,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: 'Alert must have a target',
      },
      isUUID: {
        args: 4,
        msg: 'Target ID must be UUID',
      },
    },
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Alert;
