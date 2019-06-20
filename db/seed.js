const faker = require('faker');
const {
  Family,
  Relationship,
  User,
  Poll,
  Choice,
  Event,
  Assigned,
  Vote,
} = require('./models');
const { dbSync } = require('./index');
const { dave, lauren, preston, ruby } = require('./images');

dbSync(true)
  .then(() => {
    dbSync(true).then(async () => {
      const createFamily = () => {
        return Family.create({
          name: 'DPRL',
          code: 'DPRL',
        });
      };

      const family = await createFamily();

      const createUsers = family => {
        return Promise.all([
          User.create({
            firstName: 'Dave',
            lastName: 'Siegel',
            isAdmin: true,
            imgUrl: dave,
            email: 'dave.e.siegel@gmail.com',
            password: 'p@ssWord!2',
            familyId: family.id,
          }),
          User.create({
            firstName: 'Lauren',
            lastName: 'West',
            isAdmin: true,
            imgUrl: lauren,
            email: 'laurenwest12@gmail.com',
            password: 'p@ssWord!2',
            familyId: family.id,
          }),
          User.create({
            firstName: 'Ruby',
            lastName: 'Barry',
            isAdmin: true,
            imgUrl: ruby,
            email: 'rubypbarry@gmail.com',
            password: 'p@ssWord!2',
            familyId: family.id,
          }),
          User.create({
            firstName: 'Preston',
            lastName: 'Chaplin',
            isAdmin: true,
            imgUrl: preston,
            email: 'preston.chaplin@gmail.com',
            password: 'p@ssWord!2',
            familyId: family.id,
          }),
        ]);
      };

      const users = await createUsers(family);

      const createEvents = users => {
        return Promise.all([
          Event.create({
            ownerId: users[0].id,
            title: 'Tennis Game',
            deadline: new Date('2019-06-08T12:00:00'),
            category: 'event',
          }),
          Event.create({
            ownerId: users[0].id,
            title: 'Clean the Bathroom',
            description: 'Clean the floors, sink, and shower!!',
            deadline: new Date('2019-06-15T00:00:00'),
            category: 'chore',
          }),
          Event.create({
            ownerId: users[3].id,
            title: 'Choir Recital',
            deadline: new Date('2019-07-18T17:30:00'),
            category: 'event',
          }),
        ]);
      };

      const events = await createEvents(users);

      const createRelationships = users => {
        return Promise.all([
          Relationship.create({
            userId: users[0].id,
            RelationshipId: users[1].id,
            type: 'spouse',
          }),
          Relationship.create({
            userId: users[0].id,
            RelationshipId: users[2].id,
            type: 'child',
          }),
          Relationship.create({
            userId: users[0].id,
            RelationshipId: users[3].id,
            type: 'child',
          }),
          Relationship.create({
            userId: users[1].id,
            RelationshipId: users[0].id,
            type: 'spouse',
          }),
          Relationship.create({
            userId: users[1].id,
            RelationshipId: users[2].id,
            type: 'child',
          }),
          Relationship.create({
            userId: users[1].id,
            RelationshipId: users[3].id,
            type: 'child',
          }),
          Relationship.create({
            userId: users[2].id,
            RelationshipId: users[0].id,
            type: 'parent',
          }),
          Relationship.create({
            userId: users[2].id,
            RelationshipId: users[1].id,
            type: 'parent',
          }),
          Relationship.create({
            userId: users[2].id,
            RelationshipId: users[3].id,
            type: 'sibling',
          }),
          Relationship.create({
            userId: users[3].id,
            RelationshipId: users[0].id,
            type: 'parent',
          }),
          Relationship.create({
            userId: users[3].id,
            RelationshipId: users[1].id,
            type: 'parent',
          }),
          Relationship.create({
            userId: users[3].id,
            RelationshipId: users[2].id,
            type: 'sibling',
          }),
        ]);
      };

      const relationships = await createRelationships(users);

      const createPolls = users => {
        return Promise.all([
          Poll.create({
            ownerId: users[0].id,
            text: "What's for dinner?",
            familyId: family.id,
          }),
          Poll.create({
            ownerId: users[1].id,
            text: 'What movie should we watch?',
            familyId: family.id,
          }),
          Poll.create({
            ownerId: users[3].id,
            text: 'What am I getting for Christmas?',
            familyId: family.id,
          }),
          Poll.create({
            ownerId: users[4].id,
            text: "Can we get McDonald's?",
            familyId: family.id,
          }),
        ]);
      };

      const polls = await createPolls(users);

      const createChoices = polls => {
        return Promise.all([
          Choice.create({
            text: 'Chicken',
            pollId: polls[0].id,
          }),
          Choice.create({
            text: 'Steak',
            pollId: polls[0].id,
          }),
          Choice.create({
            text: 'A Simple Favor',
            pollId: polls[1].id,
          }),
          Choice.create({
            text: 'Fight Club',
            pollId: polls[1].id,
          }),
          Choice.create({
            text: 'Coal',
            pollId: polls[2].id,
          }),
          Choice.create({
            text: 'A Barbie Dream House',
            pollId: polls[2].id,
          }),
          Choice.create({
            text: 'Yes',
            pollId: polls[3].id,
          }),
          Choice.create({
            text: 'No',
            pollId: polls[3].id,
          }),
        ]);
      };

      const choices = await createChoices(polls);

      const createAssigned = (events, polls) => {
        return Promise.all([
          Assigned.create({
            eventId: events[2].id,
            userId: polls[0].ownerId,
          }),
        ]);
      };

      const assigned = await createAssigned(events, polls);

      const createVotes = (users, polls, choices) => {
        return Promise.all([
          Vote.create({
            userId: users[0].id,
            choiceId: choices[2].id,
            pollId: polls[1].id,
          }),
          Vote.create({
            userId: users[1].id,
            choiceId: choices[3].id,
            pollId: polls[1].id,
          }),
          Vote.create({
            userId: users[2].id,
            choiceId: choices[2].id,
            pollId: polls[1].id,
          }),
          Vote.create({
            userId: users[3].id,
            choiceId: choices[2].id,
            pollId: polls[1].id,
          }),
          Vote.create({
            userId: users[4].id,
            choiceId: choices[2].id,
            pollId: polls[1].id,
          }),
        ]);
      };

      await createVotes(users, polls, choices);
    });
  })
  .catch(e => console.log(e));
