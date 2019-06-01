const expect = require('chai').expect;
const { Event, User, Assigned } = require('../../db/models');
const faker = require('faker');

describe('Event database model', () => {
    it('can create an event with status of upcoming', done => {
        Event.create({
            title: 'title',
            category: 'chore'
        })
            .then(event => {
                expect(event.title).to.equal('title');
                expect(event.status).to.equal('upcoming');
                done();
            })
            .catch(ex => done(ex));
    });
    it('will not allow an event with an invalid status', done => {
        Event.create({
            title: 'title',
            category: 'not a cat'
        })
            .then(() => {
                const e = new Error('oops, an event was created with invalid category');
                done(e);
            })
            .catch(() => done());
    });
    it('can create an event with a user as the owner', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            isAdmin: true,
            age: 36,
            email: faker.internet.email(),
            imgUrl:
                'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
            password: 'P@ssword1',
        });
        Event.create({
            title: 'title',
            category: 'event',
            ownerId: user.id
        })
            .then((event) => {
                expect(event.ownerId).to.equal(user.id)
            })
            .catch(e => { throw new Error(e) })

    });
    it('can assign an event to another user', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            isAdmin: true,
            age: 36,
            email: faker.internet.email(),
            imgUrl:
                'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
            password: 'P@ssword1',
        });
        const assignee = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            isAdmin: true,
            age: 36,
            email: faker.internet.email(),
            imgUrl:
                'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
            password: 'P@ssword1',
        });
        const event = await Event.create({
            title: 'sometitle',
            category: 'appointment',
            ownerId: user.id
        });
        Assigned.invite({
            eventId: event.id,
            userId: assignee.id
        })
            .then((assigned) => {
                expect(assigned.eventId).to.equal(event.id);
                expect(assigned.userId).to.equal(assignee.id);
            })
            .catch(e => { throw new Error(e) });
    });
    it('has a method to find all events assigned to a particular user', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            isAdmin: true,
            age: 36,
            email: faker.internet.email(),
            imgUrl:
                'https://m.media-amazon.com/images/M/MV5BODAyMGNkNWItYmFjZC00MTA5LTg3ZGItZWQ0MTIxNTg2N2JmXkEyXkFqcGdeQXVyNDQzMDg4Nzk@._V1_.jpg',
            password: 'P@ssword1',
        });
        const event = await Event.create({
            title: 'event title',
            category: 'chore'
        });
        const assigned = await Assigned.invite({
            eventId: event.id,
            userId: user.id
        });
        Event.findAssigned(user.id)
            .then(events => {
                expect(events.length).to.equal(1);
                expect(events[0].title).to.equal('event title');
                expect(events[0].category).to.equal('chore');
            })
            .catch(e => { throw new Error(e) })
    })
})
