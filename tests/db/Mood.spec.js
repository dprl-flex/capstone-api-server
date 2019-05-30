const expect = require('chai').expect;
const { Mood, User } = require('../../db');

describe('Mood Model', () => {
  beforeEach(() => Mood.destroy({ where: {}, truncate: true }));
  it('Can create a new mood record with a UserId, Value, and active set to true', done => {
    User.findOne()
      .then(user =>
        Mood.create({
          value: 0.5,
          userId: user.id,
        })
          .then(mood => {
            expect(mood.value).to.equal(0.5);
            expect(mood.active).to.equal(true);
            expect(mood.userId).to.equal(user.id);
            done();
          })
          .catch(e => done(e))
      )
      .catch(e => done(e));
  });
  it('Can replace the active mood with a new mood', done => {
    User.findOne()
      .then(user =>
        Mood.create({
          userId: user.id,
          value: 0.2,
        }).then(() =>
          Mood.create({
            userId: user.id,
            value: 0.75,
          })
            .then(() =>
              Mood.findAll({ where: { userId: user.id, active: true } })
            )
            .then(results => {
              expect(results.length).to.equal(1);
              expect(results[0].value).to.equal(0.75);
              done();
            })
        )
      )
      .catch(e => done(e));
  });
});
