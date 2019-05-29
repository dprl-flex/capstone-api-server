const expect = require('chai').expect;
const { Family } = require('../../db');
const faker = require('faker');

const familyName = faker.name.lastName();

describe('Family database model', () => {
  it('Creates a family with a correct Family name', done => {
    Family.create({
      name: familyName,
      code: `${familyName}Code`,
    })
      .then(family => {
        expect(family.name).to.equal(familyName);
        done();
      })
      .catch(e => done(e));
  });
  it('Throws an error if Family name is blank', done => {
    Family.create({
      name: '',
    })
      .then(() => {
        const e = new Error('Family name creation did not fail with bad input');
        done(e);
      })
      .catch(() => done());
  });
});
