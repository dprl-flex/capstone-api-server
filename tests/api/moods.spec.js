const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User, Mood } = require('../../db');

describe('Mood API', () => {
  beforeEach(async () => {
    await Mood.destroy({ where: {}, truncate: true });
    const user = await User.findOne();
    await Mood.create({ userId: user.id, title: 'bored' });
    await Mood.create({ userId: user.id, title: 'not bored' });
  });
  it('Can retrieve the all moods for a user', async () => {
    const user = await User.findOne();
    const response = await agent.get(`/api/moods/${user.id}/all`).expect(200);
    expect(response.body).to.have.length(2);
  });
  it('Can retrieve just the active mood for a user', async () => {
    const user = await User.findOne();
    const response = await agent.get(`/api/moods/${user.id}`).expect(200);
    expect(response.body.title).to.equal('not bored');
  });
  it('Can create a new mood', async () => {
    const user = await User.findOne();
    const response = await agent
      .post(`/api/moods/${user.id}`)
      .send({ title: 'hangry' })
      .expect(201);
    expect(response.body.active).to.equal(true);
    expect(response.body.title).to.equal('hangry');
  });
});
