const router = require('express').Router();
const { Poll, Choice, Vote } = require('../db/models');

//get all polls
router.get('/', (req, res, next) => {
  Poll.findAll()
    .then(polls => res.send(polls))
    .catch(next);
});

//get poll by id
router.get('/:id', (req, res, next) => {
  Poll.findByPk(req.params.id)
    .then(poll => res.send(poll))
    .catch(next);
});

//create new poll
router.post('/', (req, res, next) => {
  console.log(req.body);
  Poll.create(req.body)
    .then(poll => res.status(201).send(poll))
    .catch(next);
});

//get options by poll id
router.get('/:id/choices', (req, res, next) => {
  Choice.findAll({
    where: {
      pollId: req.params.id
    }
  })
    .then(choices => res.send(choices))
    .catch(next);
});

//update a poll
router.put('/:id', (req, res, next) => {
  Poll.findByPk(req.params.id)
    .then(poll => poll.update(req.body))
    .then(poll => res.status(201).send(poll))
    .catch(next);
});

//delete a poll
router.delete('/:id', (req, res, next) => {
  Poll.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

//create new option for a poll
router.post('/:id/choices', (req, res, next) => {
  Choice.create(req.body)
    .then(choice => res.status(201).send(choice))
    .catch(next);
});

//get votes by poll id
router.get('/:id/votes', (req, res, next) => {
  Vote.findAll({
    where: {
      pollId: req.params.id
    }
  })
    .then(votes => res.send(votes))
    .catch(next);
});

//get a user's vote
router.get('/:id/votes/:userId', (req, res, next) => {
  Vote.findAll({
    where: {
      pollId: req.params.id,
      userId: req.params.userId
    }
  })
    .then(votes => res.send(votes))
    .catch(next);
});

//cast a vote
router.post('/:id/votes', (req, res, next) => {
  Vote.castVote(req.body)
    .then(vote => res.send(vote))
    .catch(next);
});

//delete a vote
router.delete('/:pollId/votes/:userId', (req, res, next) => {
  Vote.destroy({
    where: {
      userId: req.params.userId,
      pollId: req.params.pollId
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
