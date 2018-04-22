const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Studio E2E Test', () => {

    before(() => dropCollection('studios'));

    let studio1 = {
        name: 'Paramount Pictures',
        address: {
            city: 'Hollywoo',
            state: 'CA',
            country: 'USA'
        }
    };

    let studio2 = {
        name: 'Universal Studios',
        address: {
            city: 'Universal City',
            state: 'CA',
            country: 'USA'
        }
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('saves a studio', () => {
        return request.post('/studios')
            .send(studio1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...studio1,
                    _id, __v
                });
                studio1 = body;
            });
    });

    it('gets a studio id', () => {
        return request.post('/studios')
            .send(studio2)
            .then(checkOk)
            .then(({ body }) => {
                studio2 = body;
                return request.get(`/studios/${studio2._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, studio2);
            });
    });

});