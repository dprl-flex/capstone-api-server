const expect = require('chai').expect;
const { Relationship, User } = require('../../db');

describe('Relationship database model', () => {
  let users = [];
  beforeEach(async () => {
    users = await User.findAll({ limit: 2 });
  });
  it('Creates a relationship with a type between two users', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(relationship => {
        expect(relationship.type).to.equal('sister');
        done();
      })
      .catch(e => done(e));
  });
});
