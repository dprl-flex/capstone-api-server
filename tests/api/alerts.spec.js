const expect = require('chai').expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User, Alert } = require('../../db');
const faker = require('faker');

describe('Alerts API', () => {
  let users;
  let alerts;
  before(async () => {
    users = await Promise.all(
      [...new Array(2)].map(() =>
        User.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          birthday: new Date('1/1/1990'),
          email: faker.internet.email(),
          imgUrl: faker.internet.avatar(),
          password: 'P@ssword1',
        })
      )
    );
    alerts = await Promise.all(
      [...new Array(2)].map(() =>
        Alert.create({
          message: 'test',
          targetId: users[0].id,
          alertType: 'user',
          userId: users[1].id,
        })
      )
    );
  });
  it('can get alerts by user', async () => {
    const _alerts = await agent.get(`/api/alerts/user/${users[1].id}`);
    expect(_alerts.body.length >= 2).to.equal(true);
  });
  it('can get an alert by id', async () => {
    const _alert = await agent.get(`/api/alerts/${alerts[0].id}`);
    expect(_alert.body.id).to.equal(alerts[0].id);
  });
  it('can deactivate an alert', async () => {
    const _alert = await agent.get(`/api/alerts/${alerts[0].id}`);
    expect(_alert.body.active).to.be.true;
    const deactivated = await agent.delete(`/api/alerts/${alerts[0].id}`);
    expect(deactivated.body.active).to.be.false;
  });
  it('can create a new alert', async () => {
    const _alert = await agent.post('/api/alerts').send({
      message: 'test2',
      targetId: users[1].id,
      alertType: 'user',
      userId: users[0].id,
    });
    expect(_alert.body.id).to.be.ok;
    expect(_alert.body.userId).to.equal(users[0].id);
    expect(_alert.body.message).to.equal('test2');
  });
});
