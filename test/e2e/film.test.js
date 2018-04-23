const { assert } = require('chai');
// const Film = require('../../lib/models/Film');
// const Studio = require('../../lib/models/Studio');
// const Actor = require('../..//lib/models/Actor');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Film E2E Test', () => {

    before(() => dropCollection('films'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));

    let studio1 = { name: 'Paramount Pictures' };

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    let actor1 = { name: 'John Krasinski' };

    before(() => {
        return request.post('/actors')
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });
    
    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let film1 = {
        title: 'A Quiet Place',
        studio: '',
        released: 2018,
        cast: [{
            characterPart: 'Lead Role',
            actor: ''
        }]
    };

    it('saves a film', () => {
        film1.studio = studio1._id;
        film1.cast.actor = actor1._id;

        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...film1,
                    _id, __v
                });
                film1 = body;
            });
    });















});