const db = require('../db');
const { Sequelize } = db;

const Assigned = db.define('assigned', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    }
});
Assigned.invite = function ({ eventId, userId }) {
    return Assigned.create({
        eventId,
        userId
    })
};

module.exports = Assigned;

