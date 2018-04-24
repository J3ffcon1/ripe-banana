const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Studio E2E Test', () => {

    before(() => dropCollection('studios'));
    before(() => dropCollection('films'));

    let film1 = {
        title: 'E.T. the Extra-Terrestrial',
        studio: Types.ObjectId,
        released: 1986,
        cast: [{ actor: Types.ObjectId }]
    };

    before(() => {
        return request.post('/films')
            .send(film1)
            .then(({ body }) => {
                film1 = body;
            });
    });

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

    const getFields = ({ _id, name }) => ({ _id, name });

    it('gets all studios', () => {
        return request.get('/studios')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [studio1, studio2].map(getFields));
            });
    });

    it('updates a studio by id', () => {
        studio1.address.city = 'Hollywood';

        return request.put(`/studios/${studio1._id}`)
            .send(studio1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, studio1);
                return request.get(`/studios/${studio1._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, studio1);
            });
    });

    it('removes a studio by id', () => {
        return request.delete(`/studios/${studio2._id}`)
            .then(checkOk)
            .then(() => {
                return request.get(`/studios/${studio2._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});