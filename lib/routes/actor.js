const router = require('express').Router();
const Actor = require('../models/Actor');
const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (actor, id) => {
    if(!actor) {
        throw {
            status: 404,
            error: `No actor by id ${id}`
        };
    }
};

module.exports = router
    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Actor.findById(id)
            .lean()
            .then(actor => {
                check404(actor, id);
                res.json(actor);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Actor.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id name')
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Actor.findByIdAndRemove(req.params.id)
            .then(removed => res.json(removed))
            .catch(next);
    });