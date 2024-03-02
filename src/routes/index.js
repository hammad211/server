const express = require('express');
const user = require('./v1/users');
const student = require('./v1/student');
const tutor = require('./v1/tutor');
const request = require('./v1/request');
const chat = require('./v1/chat');
const search = require('./v1/search');
const picture = require('./v1/picture');
const reviews = require('./v1/reviews');
const proposal = require('./v1/proposal');

const router = express.Router();

router.use('/users', user);
router.use('/student', student);
router.use('/tutor', tutor);
router.use('/request', request);
router.use('/chat', chat);
router.use('/search', search);
router.use('/picture', picture);
router.use('/reviews', reviews);
router.use('/proposal', proposal);


module.exports = router;
