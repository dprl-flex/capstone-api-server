const expect = require('chai').expect;
const { Mood, User } = require('../../db');

describe('Mood Model', () => {
  beforeEach(() => Mood.destroy({ where: {}, truncate: true }));
  it('Can create a new mood record with a UserId, Title, and active set to true', done => {
    User.findOne()
      .then(user =>
        Mood.create({
          title: 'happy',
          userId: user.id,
        })
          .then(mood => {
            expect(mood.title).to.equal('happy');
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
          title: 'angry',
        }).then(() =>
          Mood.create({
            userId: user.id,
            title: 'relaxed',
          })
            .then(() =>
              Mood.findAll({ where: { userId: user.id, active: true } })
            )
            .then(results => {
              expect(results.length).to.equal(1);
              expect(results[0].title).to.equal('relaxed');
              done();
            })
        )
      )
      .catch(e => done(e));
  });
});
