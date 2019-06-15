const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User, Event, Assigned } = require('../../db/models');
const faker = require('faker');

describe('Events API', () => {
  let userA;
  let userB;
  let eventA;
  let eventB;
  const userSeed = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    isAdmin: true,
    birthday: new Date('1/1/1990'),
    email: faker.internet.email(),
    imgUrl:
      'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
    password: 'P@ssword1',
  };
  const userSeed2 = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    isAdmin: true,
    birthday: new Date('1/1/1990'),
    email: faker.internet.email(),
    imgUrl:
      'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
    password: 'P@ssword1',
  };
  const userSeedArr = [userSeed, userSeed2];
  before(async () => {
    [userA, userB] = await User.bulkCreate(userSeedArr);
    const eventSeed = [
      {
        title: 'eventA',
        category: 'chore',
        ownerId: userA.id,
      },
      {
        title: 'eventB',
        category: 'event',
        ownerId: userA.id,
      },
    ];
    [eventA, eventB] = await Event.bulkCreate(eventSeed);
    const assign = await Assigned.invite({
      userId: userB.id,
      eventId: eventA.id,
    });
  });
  it('can find events by owner', async () => {
    const response = await agent
      .get(`/api/events/user/${userA.id}`)
      .expect(200);
    expect(response.body).to.have.length(2);
    expect(!!response.body.find(ev => ev.id === eventA.id)).to.equal(true);
  });
  it('can find events assigned to a user', async () => {
    const response = await agent
      .get(`/api/events/assigned/${userB.id}`)
      .expect(200);
    expect(response.body).to.have.length(1);
    expect(response.body[0].title).to.equal(eventA.title);
    expect(response.body[0].category).to.equal(eventA.category);
  });
  it('can update an event', async () => {
    const response = await agent
      .put(`/api/events/${eventB.id}`)
      .send({
        status: 'completed-pending',
      })
      .expect(201);
    expect(response.body.status).to.equal('completed-pending');
  });
});
