const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');


describe.only('Review E2E Test', () => {


    before(() => dropCollection('reviews'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('films'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('studios'));
    
    let actor1 = { name: 'Micheal Cera' };
    let studio1 = { name : 'Some Studio' };

    before(() => {
        return request.post('/actors')
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
                assert.ok(body._id);
            });
    });

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
                assert.ok(body._id);
            });
    });

    let reviewer1 = {
        name: 'Peter Traverse',
        company: 'Rolling Stones'
    };
    
    before(() => {
        return request.post('/reviewers')
            .send(reviewer1)
            .then(({ body }) => {
                reviewer1 = body;
                assert.ok(body._id);
            });
    });
    
    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
    
    it('saves a review', () => {
        let film1 = {
            title: 'Scott Pilgrim vs. The World',
            studio: studio1._id,
            released: 2010,
            cast: [{
                role: 'Scott pilgrim',
                actor: actor1._id
            }]
        };
        let review1 = {
            rating: 3.5,
            reviewer: reviewer1._id,
            review: 'Rolling Stone Magazine',
            film: '',
            createdAt: 2010,
            updatedAt: 2011
        };
        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                film1 = body;
                review1.film = film1._id;
                return request.post('/reviews')
                    .send(review1);
            })
            .then(checkOk)
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

//     // const getFields = ({ _id, rating, review, film }) => ({ _id, rating, review, film });

//     // it('gets a review', () => {
//     //     return request.post('/reviews')
//     //         .send(review1)
//     //         .then(checkOK)
//     //         .then(({ body }) => {
//     //             review1 = body;
//     //             return request.get(`/reviews/${review1._id}`)
//     //                 .then(({ body }) => {
//     //                     assert.deepEqual(body, review1);
//     //                 });

//     //         });
//     // });

});
