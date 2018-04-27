const router = require('express').Router();
const Review = require('../models/Review');
const ensureAuth = require('../util/ensure.auth');


module.exports = router
    .post('/', ensureAuth(),  (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .lean()
            .limit(100)
            .select('review rating')
            .populate('reviewer', 'name')
            .populate('film', 'title')
            .then(reviews => res.json(reviews))
            .catch(next);       
    });