const expect = require('chai').expect;
const { Poll, User, Choice, Vote } = require('../../db/models');
const { db } = require('../../db');
const faker = require('faker');

describe('Poll database model', () => {
  const userData = {
    firstName: 'Bob',
    lastName: 'Smith',
    age: 22,
    imgUrl:
      'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
    password: 'P@ssword1',
  };
  let user;
  beforeEach(async () => {
    userData.email = faker.internet.email();
    const createdUser = await User.create(userData);
    user = createdUser.dataValues;
  });
  it('Can create a poll', done => {
    Poll.create({
      text: 'This is a test poll question',
      ownerId: user.id,
    })
      .then(poll => {
        expect(poll.text).to.equal('This is a test poll question');
        expect(poll.ownerId).to.equal(user.id);
        done();
      })
      .catch(e => done(e));
  });
  it('poll creation fails without owner', done => {
    Poll.create({
      text: 'This is a test poll that should fail',
    })
      .then(() => {
        const e = new Error('Poll was created without owner');
        done(e);
      })
      .catch(() => done());
  });
});

describe('Choice database Model', () => {
  const userData = {
    firstName: 'Bob',
    lastName: 'Smith',
    age: 22,
    imgUrl:
      'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
    email: 'bobsmith@email.com',
    password: 'P@ssword1',
  };
  let user;
  let poll;
  beforeEach(async () => {
    await db.sync({ force: true });
    const createdUser = await User.create(userData);
    user = createdUser.dataValues;
    const createdPoll = await Poll.create({
      text: 'This is a test poll question',
      ownerId: user.id,
    });
    poll = createdPoll.dataValues;
  });
  it('Can create a choice', done => {
    Choice.create({
      text: 'This is the choice text',
      pollId: poll.id,
    })
      .then(choice => {
        expect(choice.text).to.equal('This is the choice text');
        expect(choice.pollId).to.equal(poll.id);
        done();
      })
      .catch(e => done(e));
  });
  it('choice creation fails without pollId', done => {
    Choice.create({
      text: 'This is the choice text',
    })
      .then(() => {
        const e = new Error('Choice was created without PollId');
        done(e);
      })
      .catch(() => done());
  });
});

describe('Vote database model', () => {
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
  let userMap;
  let choiceMap;
  let poll;
  beforeEach(async () => {
    // await db.sync({ force: true });
    userData[0].email = faker.internet.email();
    userData[1].email = faker.internet.email();
    const createdUsers = await User.bulkCreate(userData);
    userMap = createdUsers.map(user => user.dataValues);
    const createdPoll = await Poll.create({
      text: 'This is a poll',
      ownerId: userMap[0].id,
    });
    poll = createdPoll.dataValues;
    const createdChoices = await Promise.all([
      Choice.create({
        text: 'This is choice A',
        pollId: poll.id,
      }),
      Choice.create({
        text: 'This is choice B',
        pollId: poll.id,
      }),
    ]);
    choiceMap = createdChoices.map(choice => choice.dataValues);
  });
  it('can cast a vote', done => {
    Vote.castVote({
      pollId: poll.id,
      choiceId: choiceMap[0].id,
      userId: userMap[1].id,
    })
      .then(vote => {
        expect(vote.pollId).to.equal(poll.id);
        expect(vote.choiceId).to.equal(choiceMap[0].id);
        expect(vote.userId).to.equal(userMap[1].id);
        done();
      })
      .catch(e => done(e));
  });
  it('will not let a user vote twice on the same poll', done => {
    Vote.castVote({
      pollId: poll.id,
      choiceId: choiceMap[0].id,
      userId: userMap[0].id,
    }).then(() => {
      Vote.castVote({
        pollId: poll.id,
        choiceId: choiceMap[1].id,
        userId: userMap[0].id,
      })
        .then(() => {
          const e = new Error(
            'Oops! The user was able to vote twice on one poll'
          );
          done(e);
        })
        .catch(() => done());
    });
  });
});
