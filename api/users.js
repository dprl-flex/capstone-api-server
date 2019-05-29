const router = require('express').Router();
const { User, Relationship, Poll } = require('../db/models');


//get all users
router.get('/', (req, res, next) => {
    User.findAll()
        .then(users => res.send(users))
        .catch(next)
});

//get user by id
router.get('/:id', (req, res, next) => {
    User.findByPk(req.params.id)
        .then(user => res.send(user))
        .catch(next)
});

//create new user
router.post('/', (req, res, next) => {
    User.create(req.body)
        .then(user => res.send(user))
        .catch(next);
})

//get users relationships
router.get('/:id/relationships', (req, res, next) => {
    Relationship.findAll({
        where: {
            userId: req.params.id
        }
    })
        .then(relationships => res.send(relationships))
        .catch(next)
});

//get users polls
router.get('/:id/polls', (req, res, next) => {
    Poll.findAll({
        where: {
            ownerId: req.params.id
        }
    })
        .then(polls => res.send(polls))
        .catch(next);
});

module.exports = router;
