const db = require('../db');
const { Sequelize } = db;
const User = require('./User');
const Op = Sequelize.Op;

const Relationship = db.define('relationship', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg:
          'You must enter your type of relationship (ex: sister, mother, father, child).',
      },
    },
  },
  status: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 1,
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
});

Relationship.updateStatus = (userId, RelationshipId, diff) => {
  return Relationship.findOne({ where: { userId, RelationshipId } }).then(
    relationship => {
      let status = relationship.status + diff;
      if (status > 1) status = 1;
      if (status < 0) status = 0;
      return relationship.update({ status });
    }
  );
};

Relationship.findRelated = (userId) => {
  return Relationship.findAll({
    where: {
      userId
    }
  })
    .then(relationships => {
      return User.findAll({
        where: {
          id: {
            [Op.in]: relationships.map(relationship => relationship.RelationshipId)
          }
        }
      })
    })
}

module.exports = Relationship;
