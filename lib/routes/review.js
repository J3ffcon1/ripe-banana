const router = require('express').Router();
const Review = require('../models/Review');

module.exports = router
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .select('_id review rating film')
            .populate({
                path: 'film',
                select: 'title'
            })
            .lean()
            .then(reviews => res.json(reviews))
            .catch(next);       
    });