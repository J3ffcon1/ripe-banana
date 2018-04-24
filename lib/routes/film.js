const router = require('express').Router();
const Film = require('../models/Film');

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });
    