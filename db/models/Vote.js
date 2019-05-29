const db = require('../db');
const { Sequelize } = db;

const Vote = db.define('vote', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    }
}, {
        hooks: {
            beforeCreate: function (vote) {
                if (!vote.choiceId) {
                    throw new Error('vote must have a choiceId')
                }
                if (!vote.userId) {
                    throw new Error('vote must have a userId')
                }
            }
        }
    });

Vote.castVote = function ({ userId, pollId, choiceId }) {
    return Vote.findOne({
        where: {
            userId: userId,
            pollId: pollId
        }
    })
        .then(vote => {
            if (vote) {
                throw new Error('You can only vote once per poll!')
            } else {
                return Vote.create({ userId, pollId, choiceId })
            }
        });
}

module.exports = Vote;
