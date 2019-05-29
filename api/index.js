const router = require('express').Router();

router.use('/users', require('./users'));

router.use('/families', require('./families'));

router.use('/polls', require('./polls'));

router.use('/moods', require('./moods'));

module.exports = router;
