const expect = require('chai').expect;
const { User } = require('../../db');
const faker = require('faker');
const jwt = require('jwt-simple');

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
  it('will not send the password when using default scope', done => {
    User.findOne()
      .then(user => {
        expect(user.password).not.to.be.ok;
        done();
      })
      .catch(e => done(e));
  });
  it('will send email and password when using login scope', done => {
    User.scope('login')
      .findOne()
      .then(user => {
        expect(user.email).to.be.ok;
        expect(user.password).to.be.ok;
        done();
      })
      .catch(e => done(e));
  });
  it('hashes the password when the user is created', done => {
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
        expect(user.password).to.be.ok;
        expect(user.password).not.to.equal('P@ssword1');
        done();
      })
      .catch(e => done(e));
  });
  it('can log a user in, and get back the correct token', done => {
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
      .then(user =>
        User.authenticate(user.email, 'P@ssword1').then(token => {
          expect(token).to.equal(jwt.encode(user.id, process.env.SECRET));
          done();
        })
      )
      .catch(e => done(e));
  });
});
