const router = require('express').Router();
const { Event, Assigned } = require('../db/models');

//get all events

router.get('/', (req, res, next) => {
    Event.findAll()
        .then(events => res.send(events))
        .catch(next)
});

//get events by user

router.get('/user/:id', (req, res, next) => {
    Event.findAll({
        where: {
            ownerId: req.params.id
        }
    })
        .then(events => res.send(events))
        .catch(next);
});

//get users assigned events

router.get('/assigned/:id', (req, res, next) => {
    Event.findAssigned(req.params.id)
        .then(assigned => res.send(assigned))
        .catch(next);
});

//create new event

router.post('/', (req, res, next) => {
    Event.create(req.body)
        .then(event => res.status(201).send(event))
        .catch(next);
});

//update event

router.put('/:id', (req, res, next) => {
    Event.findByPk(req.params.id)
        .then(event => event.update(req.body))
        .then(event => res.status(201).send(event))
        .catch(next);
});

//delete event

router.delete('/:id', (req, res, next) => {
    Event.findByPk(req.params.id)
        .then(event => event.destroy())
        .then(() => res.sendStatus(204))
        .catch(next);
});

module.exports = router;
