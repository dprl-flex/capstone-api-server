'use strict';

const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User, Poll, Vote, Choice } = require('../../db/models');
const { db } = require('../../db');
const faker = require('faker');

describe('Polling routes', async () => {
  let userMap;
  let pollMap;
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
    Poll.destroy({ where: {} });
    userData[0].email = faker.internet.email();
    userData[1].email = faker.internet.email();
    const createdUsers = await User.bulkCreate(userData);
    userMap = createdUsers.map(user => user.dataValues);
    const createdPolls = await Promise.all([
      Poll.create({
        text: 'This is the first polling question',
        ownerId: userMap[0].id,
      }),
      Poll.create({
        text: 'This is the second poll',
        ownerId: userMap[0].id,
      }),
    ]);
    pollMap = createdPolls.map(poll => poll.dataValues);
  });
  describe('GET /api/polls', () => {
    it('retrieves all polls', async () => {
      const response = await agent.get('/api/polls').expect(200);
      expect(response.body).to.have.length(2);
    });
  });
  describe('POST /api/polls', () => {
    it('creates a new poll', async () => {
      const response = await agent
        .post('/api/polls')
        .send({
          text: 'Testing the poll post route',
          ownerId: userMap[1].id,
        })
        .expect(201);
      expect(response.body.text).to.equal('Testing the poll post route');
    });
  });
});
