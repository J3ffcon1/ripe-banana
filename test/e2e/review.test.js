
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

    before(() => {
        return request.post('/reviewers')
            .send(traverse)
            .then(({ body }) => {
                traverse = body;
            });
    });
    let studio = {
        name:'Universal Studios'
    };

    before(() => {
        return request.post('/studios')
            .send(studio)
            .then(({ body }) => {
                studio = body;
            });
    });

    let scottpilgrim = {
        title: 'Scott Pilgrim vs. The World', //make a  mock film to test
        studio: 42,
        released: 2010,
        cast: []
    };

    before(() => {
        return request.post('/films')  
            .send(scottpilgrim)
            .then(({ body }) => {
                scottpilgrim = body;
            });
    });

    let review1 = {
        rating: 3.5,
        review :'Rolling Stone Magazine'
    };

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


});
