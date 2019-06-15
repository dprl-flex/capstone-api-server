const expect = require('chai').expect;
const { Alert, User } = require('../../db');
const faker = require('faker');

describe('Alert Model', () => {
  let owner;
  before(async () => {
    owner = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthday: new Date('1/1/1996'),
      email: faker.internet.email(),
      imgUrl: faker.internet.avatar(),
      password: 'P@ssword1',
    });
  });
  it('exists', () => {
    expect(Alert).to.be.ok;
  });
  it('can create an alert and return it', async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthday: new Date('1/1/1996'),
      email: faker.internet.email(),
      imgUrl: faker.internet.avatar(),
      password: 'P@ssword1',
    });
    const alert = await Alert.create({
      message: 'test',
      targetId: user.id,
      alertType: 'user',
      userId: owner.id,
    });
    expect(alert.message).to.equal('test');
    expect(alert.userId).to.equal(owner.id);
    expect(alert.targetId).to.equal(user.id);
    expect(alert.alertType).to.equal('user');
  });
});
