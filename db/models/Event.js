const db = require('../db');
const { Sequelize } = db;

const Event = db.define('event', {
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
                msg: 'Event must have a title.'
            }
        }
    },
    deadline: {
        type: Sequelize.DATE
    },
    category: {
        type: Sequelize.ENUM('chore', 'errand', 'appointment', 'event'),
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('upcoming', 'overdue', 'missed', 'completed-pending', 'completed'),
        defaultValue: 'upcoming'
    },
    description: {
        type: Sequelize.TEXT
    }

})

module.exports = Event;
