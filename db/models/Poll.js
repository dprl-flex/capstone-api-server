const db = require('../db');
const { Sequelize } = db;

const Poll = db.define('poll', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'You must enter a question'
            }
        }
    }
}, {
        hooks: {
            beforeCreate: function (poll) {
                if (!poll.ownerId) {
                    throw new Error('poll must have ownerId')
                }
            }
        }
    });

module.exports = Poll;
