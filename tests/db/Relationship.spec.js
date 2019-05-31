const expect = require('chai').expect;
const { Relationship, User } = require('../../db');

describe('Relationship database model', () => {
  let users = [];
  beforeEach(async () => {
    if (users.length) {
      users.forEach(user =>
        Relationship.destroy({ where: { userId: user.id } })
      );
    }
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
  it('Relationships are created with a status of 1', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(relationship => {
        expect(relationship.status).to.equal(1);
        done();
      })
      .catch(e => done(e));
  });
  it('Can decrement status', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(() => Relationship.updateStatus(users[0].id, users[1].id, -0.2))
      .then(relationship => {
        expect(relationship.status).to.equal(0.8);
        done();
      })
      .catch(e => done(e));
  });
  it('Can increment status', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(() => Relationship.updateStatus(users[0].id, users[1].id, -0.2))
      .then(() => Relationship.updateStatus(users[0].id, users[1].id, 0.15))
      .then(relationship => {
        expect(relationship.status).to.be.greaterThan(0.95);
        expect(relationship.status).to.be.lessThan(0.96);
        done();
      })
      .catch(e => done(e));
  });
  it('will set status to 1 if new status is greater than 1', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(() => Relationship.updateStatus(users[0].id, users[1].id, 2))
      .then(relationship => {
        expect(relationship.status).to.equal(1);
        done();
      })
      .catch(e => done(e));
  });
  it('will set status to 0 if new status is less than 0', done => {
    Relationship.create({
      type: 'sister',
      userId: users[0].id,
      RelationshipId: users[1].id,
    })
      .then(() => Relationship.updateStatus(users[0].id, users[1].id, -2))
      .then(relationship => {
        expect(relationship.status).to.equal(0);
        done();
      })
      .catch(e => done(e));
  });
});
