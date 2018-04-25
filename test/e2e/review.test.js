const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// const { Types } = require('mongoose');

describe('Review E2E Test', () => {

    before(() => dropCollection('reviews'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('films'));

    let traverse = {
        name: 'Peter Traverse',  //make a mock critic to test
        company: 'Rolling Stones'
    };

    let studio = {
        name: 'Universal Studios'
    };

    let actor = {
        name: 'Michael Cera',
    };
    let scottpilgrim = {
        title: 'Scott Pilgrim vs. The World', //make a  mock film to test
        studio: studio._id,
        released: 2010,
        cast: [{
            role: 'Scott pilgrim',
            actor: actor._id

        }]
    };

    let review1 = {
        rating: 3.5,
        reviewer: traverse._id,
        review: 'Rolling Stone Magazine',
        film: scottpilgrim._id,
        createdAt: 2010,
        updatedAt: 2011
    };




    before(() => {
        return request.post('/actors')
            .send(actor)
            .then(({ body }) => {
                actor = body;
                assert.ok(body._id);
            });
    });


    before(() => {
        return request.post('/reviewers')
            .send(traverse)
            .then(({ body }) => {
                traverse = body;
                assert.ok(body._id);
            });
    });

    before(() => {
        return request.post('/films')
            .send(scottpilgrim)
            .then(({ body }) => {
                scottpilgrim = body;
                assert.ok(body);
            });
    });


    before(() => {
        return request.post('/studios')
            .send(studio)
            .then(({ body }) => {
                studio = body;
            });
    });




    const checkOK = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a review', () => {
        review1.reviewer = traverse._id;
        review1.film = scottpilgrim._id;

        return request.post('/reviews')
            .send(review1)
            .then(checkOK)
            .then(({ body }) => {
                const { _id, __v, createdAt, updatedAt } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.ok(createdAt);
                assert.ok(updatedAt);
                assert.deepEqual(body, {
                    ...review1,
                    _id, __v, createdAt, updatedAt
                });
                review1 = body;
            });
    });

    // const getFields = ({ _id, rating, review, film }) => ({ _id, rating, review, film });

    it('gets a review', () => {
        return request.post('/reviews')
            .send(review1)
            .then(checkOK)
            .then(({ body }) => {
                review1 = body;
                return request.get(`/reviews/${review1._id}`)
                    .then(({ body }) => {
                        assert.deepEqual(body, review1);
                    });

            });
    });



});
