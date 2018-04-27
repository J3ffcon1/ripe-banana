const router = require('express').Router();
const Review = require('../models/Review');
const ensureAuth = require('../util/ensure.auth');
const ensureRole = require('../util/ensure.role');
/* eslint no-console: off */

module.exports = router
    .post('/', ensureAuth(), ensureRole('admin'), (req, res, next) => {
        Review.create(req.body)
            .then(() => console.log('Hello'))
            // .then(review => res.json(review))
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