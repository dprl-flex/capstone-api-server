const router = require('express').Router();
const { Alert } = require('../db');

//get all alerts for a user
router.get('/user/:id', (req, res, next) => {
  Alert.findAll({ where: { userId: req.params.id } })
    .then(alerts => res.send(alerts))
    .catch(next);
});

//get single alert by id
router.get('/:id', (req, res, next) => {
  Alert.findByPk(req.params.id)
    .then(alert => res.send(alert))
    .catch(next);
});

//create alert
router.post('/', (req, res, next) => {
  Alert.create(req.body)
    .then(alert => res.status(201).send(alert))
    .catch(next);
});

//deactivate alert
router.delete('/:id', (req, res, next) => {
  Alert.findByPk(req.params.id)
    .then(alert => alert.update({ active: false }))
    .then(alert => res.status(201).send(alert))
    .catch(next);
});

module.exports = router;
