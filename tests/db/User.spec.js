const expect = require('chai').expect;
const { User } = require('../../db');
const faker = require('faker');

describe('User database model', () => {
  it('Can create a user with the necessary fields entered', done => {
    User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      isAdmin: true,
      age: 36,
      email: faker.internet.email(),
      imgUrl:
        'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
      password: 'P@ssword1',
    })
      .then(user => {
        const keys = Object.keys(user.get());
        expect(keys.includes('firstName')).to.equal(true);
        expect(keys.includes('lastName')).to.equal(true);
        expect(keys.includes('isAdmin')).to.equal(true);
        expect(keys.includes('age')).to.equal(true);
        expect(keys.includes('email')).to.equal(true);
        expect(keys.includes('imgUrl')).to.equal(true);
        expect(keys.includes('password')).to.equal(true);
        done();
      })
      .catch(e => done(e));
  });
  it('Throws an error if a required field is blank', done => {
    User.create({
      firstName: faker.name.firstName(),
      isAdmin: true,
      age: 36,
      email: faker.internet.email(),
      imgUrl:
        'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
      password: 'P@ssword1',
    })
      .then(() => {
        const e = new Error('User creation did not fail with bad input');
        done(e);
      })
      .catch(e => done());
  });
  it('Throws an error if a password does not meet the complexity and length requirements', done => {
    User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      isAdmin: true,
      age: 36,
      email: faker.internet.email(),
      imgUrl:
        'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
      password: 'passwor',
    })
      .then(() => {
        const e = new Error('User was created with invalid password');
        done(e);
      })
      .catch(() => done());
  });
});
