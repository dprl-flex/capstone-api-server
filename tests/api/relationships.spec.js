const chai = require('chai');
const expect = chai.expect;
const app = require('../../server').app;
const agent = require('supertest')(app);
const { User, Relationship } = require('../../db');

describe('Relationship API', () => {
  let relationship;
  let user1, user2;
  before(async () => {
    [user1, user2] = await User.findAll({ limit: 2 });
    await Relationship.destroy({ where: { userId: user1.id } });
    relationship = await Relationship.create({
      userId: user1.id,
      RelationshipId: user2.id,
      type: 'brother',
    });
  });
  it('Can retrieve all relationships for a user', async () => {
    const relationships = await agent.get(
      `/api/users/${user1.id}/relationships`
    );
    expect(!!relationships.body.find(r => r.id === relationship.id)).to.equal(
      true
    );
  });
  it('Can update the status of an existing relationship', async () => {
    const updated = await agent
      .put(`/api/users/${user1.id}/relationships/status`)
      .send({ RelationshipId: user2.id, diff: -0.2 });
    expect(updated.body.status).to.equal(0.8);
  });
  it('Can update the type of relationship', async () => {
    const updated = await agent
      .put(`/api/users/${user1.id}/relationships/type`)
      .send({ RelationshipId: user2.id, type: 'sibling' });
    expect(updated.body.type).to.equal('sibling');
  });
  it('Can create a new relationship', async () => {
    const newRelationship = await agent
      .post(`/api/users/${user2.id}/relationships`)
      .send({ RelationshipId: user1.id, type: 'brother' });
    expect(newRelationship.body.type).to.equal('brother');
  });
  it('Can delete a relationship', async () => {
    await agent
      .delete(`/api/users/${user1.id}/relationships`)
      .send({ RelationshipId: user2.id });
    const found = await agent.get(`/api/users/${user1}/relationships`);
    expect(Array.isArray(found.body)).to.equal(false);
  });
});
