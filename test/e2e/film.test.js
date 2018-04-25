const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Film E2E Test', () => {

    before(() => dropCollection('films'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    
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

    let reviewer1 = { 
        name: 'Some Gal',
        company: 'Some Company' };

    before(() => {
        return request.post('/reviewers')
            .send(reviewer1)
            .then(({ body }) => {
                reviewer1 = body;
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
            role: 'grizzled farm dad',
            actor: ''
        }]
    };

    let film2 = {
        title: 'fuck this shiiiiiiiiiiiiiiiit',
        studio: '',
        released: 2018,
        cast: [{
            role: 'going to blow my brains out',
            actor: ''
        }]
    };

    before(() => {
        film2.studio = studio1._id;
        film2.cast[0].actor = actor1._id;
        return request.post('/films')
            .send(film2)
            .then(({ body }) => {
                film2 = body;
            });
    });

    it('saves a film', () => {
        film1.studio = studio1._id;
        film1.cast[0].actor = actor1._id;

        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body.cast[0].actor, film1.cast[0].actor);       
            });
    });

    it('get film by id', () => {  
        
        let review1 = {
            rating: 5,
            reviewer: reviewer1._id,
            review: 'It was ok',
            film: film2._id,
            createdAt: new Date(),
            UpdatedAt: new Date()
        };
        
        return request.post('/reviews')
            .send(review1)
            .then(checkOk)
            .then(({ body }) => {
                review1 = body;
                return request.get(`/films/${film2._id}`);
            })
            .then(({ body }) => {
                console.log('error', body);
                assert.equal(body, {
                    ...film2,
                    reviews: [{
                        _id: review1._id,
                        rating: review1._rating,
                        review: review1.review,
                        reviewer: {
                            _id: review1.reviewer._id,
                            name: review1.reviewer.name
                        }
                    }]
                });
            });
    });

});