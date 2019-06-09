'use strict';

const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User } = require('../../db');
const faker = require('faker');
const jwt = require('jwt-simple');

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
      const response = await agent
        .get(`/api/users/${userMap[1].id}`)
        .expect(200);
      expect(response.body.firstName).to.equal(userMap[1].firstName);
    });
  });
  describe('PUT /api/users/login', () => {
    it('can log a user in', async () => {
      const response = await agent.put(`/api/users/login`).send({
        email: userMap[0].email,
        password: 'P@ssword1',
      });
      expect(response.text).to.equal(
        jwt.encode(userMap[0].id, process.env.SECRET)
      );
    });
  });
  describe('GET /api/users/authed', () => {
    it('can get a user based on a token.', async () => {
      const response = await agent.put(`/api/users/login`).send({
        email: userMap[0].email,
        password: 'P@ssword1',
      });
      const userResponse = await agent
        .get('/api/users/authed')
        .set({ authorization: response.text });
      expect(userResponse.body.id).to.equal(userMap[0].id);
    });
  });
  describe('POST /api/users', () => {
    it('can create a user and return the token for that user', async () => {
      const newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        age: 20,
        imgUrl: 'http://www.gstatic.com/tv/thumb/persons/49256/49256_v9_ba.jpg',
        password: 'P@ssword1',
      };
      const response = await agent.post('/api/users').send(newUser);
      const token = response.text;
      const created = await agent
        .get('/api/users/authed')
        .set({ authorization: token });
      expect(created.body.email.toLowerCase()).to.equal(
        newUser.email.toLowerCase()
      );
    });
  });
});
