const router = require('express').Router();
const Studio = require('../models/Studio');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (studio, id) => {
    if(!studio) {
        throw {
            status: 404,
            error: `Studio id ${id} does not exist`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Studio.findById(id)
            .lean()
            .populate({
                
            })
            .then(studio => {
                check404(studio, id);
                res.json(studio);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Studio.find(req.query)
            .lean()
            .limit(10)
            .select('name')
            .then(studio => res.json(studio))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });