'use strict';

const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User } = require('../../db');
const faker = require('faker');

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
    const createdUsers = await User.bulkCreate(userData);
    userMap = createdUsers.map(user => user.dataValues);
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
});
