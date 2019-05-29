const router = require('express').Router();
const { Mood } = require('../db');

//get all moods for user
router.get('/:id/all', (req, res, next) => {
  Mood.findAll({ where: { userId: req.params.id } })
    .then(moods => res.json(moods))
    .catch(next);
});

//get current mood for user
router.get('/:id', (req, res, next) => {
  Mood.findOne({ where: { userId: req.params.id, active: true } })
    .then(mood => res.json(mood))
    .catch(next);
});

//create mood
router.post('/:id', (req, res, next) => {
  console.log('BODY', req.body);
  Mood.create({
    userId: req.params.id,
    title: req.body.title,
  })
    .then(mood => res.status(201).json(mood))
    .catch(next);
});

module.exports = router;
