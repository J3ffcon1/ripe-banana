const router = require('express').Router();
const Film = require('../models/Film');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const Review = require('../models/Review');
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
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            Film.findById(id)
                .lean()
                .select('title studio released cast')
                .populate({
                    path: 'cast.actor',
                    select: '_id name'
                })
                .populate({
                    path: 'studio',
                    select: '_id name'
                }),
            Review.find({ 'film': id })
                .lean()
                .select('rating review reviewer')
                .populate({
                    path: 'reviewer',
                    select: '_id name'
                })
        ])
            .then(([film, review]) => {
                check404(film, id);
                film.review = review;
                res.json(film);
            })
            .catch(next);
    });
