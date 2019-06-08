const router = require('express').Router();
const { Family, User, Mood, Poll } = require('../db/models');

//get all families
router.get('/', (req, res, next) => {
  Family.findAll()
    .then(families => res.send(families))
    .catch(next);
});

//get family by id
router.get('/:id', (req, res, next) => {
  Family.findByPk(req.params.id)
    .then(family => res.send(family))
    .catch(next);
});

//get all users in a family
router.get('/:id/users', (req, res, next) => {
  User.findAll({
    where: {
      familyId: req.params.id
    },
    include: [Mood]
  })
    .then(users => res.send(users))
    .catch(next);
});

//get all polls in a family
router.get('/:id/polls', (req, res, next) => {
  Poll.findAll({
    where: {
      familyId: req.params.id
    }
  })
    .then(polls => res.send(polls))
    .catch(next);
});

module.exports = router;
