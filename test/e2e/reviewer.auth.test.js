const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { sign } = require('../../lib/util/token-service');

describe.only('testing authorization for reviewer', () => {
   
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('films'));

    before(() => {
        return request.post('/reviewers')
            .send(user1)
            .then(({ body }) => {
                user1 = body;
            });
    });

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    before(() => {
        return request.post('/films')
            .send(film1)
            .then(({ body }) => {
                film1 = body;
            });
    });
    
    let studio1 = {
        name: 'Universal Pictures',
    };
    let film1 = {
        title: 'Shutter Island',
        studio1: studio1._id,
        released: 1924,
        cast: [] 
    };



    let user1 = {
        name: 'Terry',
        company:'Legacy',
        email:'me@gmail.com',
        hash: 'heres a hash',
        roles:['user']
    };

    let user1token = sign(user1);

    // let user2token = sign(user2);

    // let user2 = {
    //     name: 'boss',
    //     company: 'boss inc.',
    //     email: 'boss@gmail.com',
    //     hash:'hash',
    //     roles:['admin']
    // };

    let Review = {
        rating: 2,
        reviewer:user1._id,
        review: 'it was a 2 at best',
        film:film1._id,
        createdAt: 2010,
        updatedAt: 2011
    };

    it('Post method authentication', () => {
        return request.post('/reviews')
            .send(Review)
            .then(result => {
                assert.equal(result.status, 400);
                assert.equal(result.body.error, 'No token found');
            });

    });

    it('Post method authentication suceeds', () => {
        return request.post('/reviews')
            .set('Authorization', user1token)
            .send(Review)
            .then(result => {
                assert.equal(result.status, 400);
            });

    });
    

    // it('Post method authorization', () => {
    //     return request.post('/reviews')
    //         .set('Authoization', user1token)
    //         .send(Review)
    //         .then(result => {
    //             assert.equal(result.status, 403);
    //         });

    // });






});