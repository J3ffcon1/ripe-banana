const router = require('express').Router();
const Film = require('../models/film');
const Actor = require('../models/actor');
const Studio = require('../models/studio');
const { updateOptions } = require('../util/mongoose-helpers');
const check404 = require('./check-404');

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });