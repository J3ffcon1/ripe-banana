const router = require('express').Router();
const Film = require('../models/Film');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status: 404,
            error: `No film by id ${id}`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });