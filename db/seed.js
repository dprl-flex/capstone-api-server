const faker = require('faker');
const { Family, Relationship, User, Poll, Choice } = require('./models');
const { dbSync } = require('./index');

dbSync(true).then(() => {
  Family.create({
    name: 'Marx',
    code: 'MarxBros'
  })
    .then(family => {
      const famCount = [...new Array(4)];
      const lastName = faker.name.lastName();
      return Promise.all(
        famCount.map((v, idx) =>
          User.create({
            firstName: faker.name.firstName(),
            lastName,
            isAdmin: idx < 2,
            age: idx < 2 ? 30 : 12,
            imgUrl: faker.internet.avatar(),
            email: faker.internet.email(),
            password: 'tH1s1sVal1d!',
            familyId: family.id
          })
        )
      );
    })
    .then(([p1, p2, c1, c2]) => {
      return Promise.all([
        Relationship.create({
          userId: p1.id,
          RelationshipId: p2.id,
          type: 'spouse'
        }),
        Relationship.create({
          userId: p1.id,
          RelationshipId: c1.id,
          type: 'child'
        }),
        Relationship.create({
          userId: p1.id,
          RelationshipId: c2.id,
          type: 'child'
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: p1.id,
          type: 'spouse'
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: c1.id,
          type: 'child'
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: c2.id,
          type: 'child'
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: p1.id,
          type: 'parent'
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: p2.id,
          type: 'parent'
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: c2.id,
          type: 'sibling'
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: p1.id,
          type: 'parent'
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: p2.id,
          type: 'parent'
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: c1.id,
          type: 'sibling'
        }),
        Poll.create({
          ownerId: p1.id,
          text: "What's for dinner?"
        }),
        Poll.create({
          ownerId: p2.id,
          text: 'What movie should we watch?'
        }),
        Poll.create({
          ownerId: c1.id,
          text: 'What am I getting for Christmas?'
        }),
        Poll.create({
          ownerId: c2.id,
          text: "Can we get McDonald's?"
        })
      ]);
    })
    .then(
      ([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, p1, p2, p3, p4]) => {
        return Promise.all([
          Choice.create({
            text: 'Chicken',
            pollId: p1.id
          }),
          Choice.create({
            text: 'Steak',
            pollId: p1.id
          }),
          Choice.create({
            text: 'A Simple Favor',
            pollId: p2.id
          }),
          Choice.create({
            text: 'Fight Club',
            pollId: p2.id
          }),
          Choice.create({
            text: 'Coal',
            pollId: p3.id
          }),
          Choice.create({
            text: 'A Barbie Dream House',
            pollId: p3.id
          }),
          Choice.create({
            text: 'Yes',
            pollId: p4.id
          }),
          Choice.create({
            text: 'No',
            pollId: p4.id
          })
        ]);
      }
    )
    .catch(e => console.log(e));
});
