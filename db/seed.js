const faker = require('faker');
const { Family, Relationship, User, Mood } = require('./models');
const { dbSync } = require('./index');

dbSync(true).then(() => {
  Family.create({
    name: 'Marx',
    code: 'MarxBros',
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
            familyId: family.id,
          })
        )
      );
    })
    .then(([p1, p2, c1, c2]) => {
      return Promise.all([
        Relationship.create({
          userId: p1.id,
          RelationshipId: p2.id,
          type: 'spouse',
        }),
        Relationship.create({
          userId: p1.id,
          RelationshipId: c1.id,
          type: 'child',
        }),
        Relationship.create({
          userId: p1.id,
          RelationshipId: c2.id,
          type: 'child',
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: p1.id,
          type: 'spouse',
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: c1.id,
          type: 'child',
        }),
        Relationship.create({
          userId: p2.id,
          RelationshipId: c2.id,
          type: 'child',
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: p1.id,
          type: 'parent',
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: p2.id,
          type: 'parent',
        }),
        Relationship.create({
          userId: c1.id,
          RelationshipId: c2.id,
          type: 'sibling',
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: p1.id,
          type: 'parent',
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: p2.id,
          type: 'parent',
        }),
        Relationship.create({
          userId: c2.id,
          RelationshipId: c1.id,
          type: 'sibling',
        }),
        Mood.create({
          userId: p1.id,
          title: 'stressed',
        }).then(() =>
          Mood.create({
            userId: p1.id,
            title: 'relaxed',
          })
        ),
      ]);
    })
    .catch(e => console.log(e));
});
