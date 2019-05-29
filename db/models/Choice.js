const db = require('../db');
const { Sequelize } = db;

const Choice = db.define('choice', {
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
                msg: 'You must enter text for this choice'
            }
        }
    }
}, {
        hooks: {
            beforeCreate: function (choice) {
                if (!choice.pollId) {
                    throw new Error('choice must have pollId')
                }
            }
        }
    });

module.exports = Choice;
