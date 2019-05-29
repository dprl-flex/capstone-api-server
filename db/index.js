const db = require('./db');
const {
  User,
  Family,
  Relationship,
  Poll,
  Choice,
  Vote,
  Mood,
} = require('./models');

const dbSync = (force = false) => {
  return db.authenticate().then(() => db.sync({ force }));
};

module.exports = {
  dbSync,
  db,
  User,
  Family,
  Relationship,
  Poll,
  Choice,
  Vote,
  Mood,
};
