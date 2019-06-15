const router = require('express').Router();
const { Alert, User } = require('../db');
const twilioClient = require('./twilio');

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
router.post('/', async (req, res, next) => {
  const user = await User.findByPk(req.body.userId);
  Alert.create(req.body)
    .then(alert => {
      twilioClient.messages.create({
        body: alert.message,
        from: '+12013714172',
        to: `+1${user.phone}`,
      });
      res.status(201).send(alert);
    })
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
