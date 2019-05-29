const db = require('../db')
const { Sequelize } = db

const Relationship = db.define('relationship', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg:
          'You must enter your type of relationship (ex: sister, mother, father, child).'
      }
    }
  }
})

module.exports = Relationship
