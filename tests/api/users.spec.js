'use strict';

const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User } = require('../../db');
const faker = require('faker');
const session = require('supertest-session');

let testSession = null;

describe('User Routes', () => {
  let userMap;
  const userData = [
    {
      firstName: 'Bob',
      lastName: 'Smith',
      age: 22,
      imgUrl:
        'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
      password: 'P@ssword1',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      age: 35,
      imgUrl:
        'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
      password: 'P@ssword1',
    },
  ];

  beforeEach(async () => {
    userData[0].email = faker.internet.email();
    userData[1].email = faker.internet.email();
    userMap = await Promise.all(userData.map(user => User.create(user)));
  });
  describe('GET api/users', () => {
    it('sends all users', async () => {
      const response = await agent.get('/api/users').expect(200);
      expect(response.body).to.have.length.greaterThan(1);
      expect(!!response.body.find(user => user.id === userMap[0].id)).to.equal(
        true
      );
      expect(!!response.body.find(user => user.id === userMap[1].id)).to.equal(
        true
      );
    });
  });
  describe('GET api/users/:id', () => {
    it('sends a specific user by their id', async () => {
      console.log(userMap[1].id);
      const response = await agent
        .get(`/api/users/${userMap[1].id}`)
        .expect(200);
      expect(response.body.firstName).to.equal(userMap[1].firstName);
    });
  });
  describe('PUT /api/users/login', () => {
    it('can log a user in', async () => {
      const response = await agent.put(`/api/users/login`).send({
        email: userData[0].email,
        password: userData[0].password,
      });
      expect(response.body.email).to.equal(userData[0].email);
    });
  });
  describe('GET /api/users/session', () => {
    beforeEach(() => {
      testSession = session(app);
    });
    it('can get a session for a logged in user', async () => {
      await testSession.put(`/api/users/login`).send({
        email: userData[0].email,
        password: userData[0].password,
      });
      const loggedInUser = await testSession.get('/api/users/session');
      expect(loggedInUser.body.email).to.equal(userData[0].email);
    });
    it('will throw an error if there is no logged in user', async () => {
      const response = await testSession.get('/api/users/session');
      expect(response.error).to.be.ok;
      expect(response.status).to.equal(404);
    });
  });
  describe('DELETE/ api/users/logout', () => {
    it('can log a user out', async () => {
      await testSession.put(`/api/users/login`).send({
        email: userData[0].email,
        password: userData[0].password,
      });
      await testSession.delete('/api/users/logout');
      const response = await testSession.get('/api/users/session');
      expect(response.status).to.equal(404);
    });
  });
});
