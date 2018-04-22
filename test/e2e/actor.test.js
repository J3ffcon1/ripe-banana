const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Actor E2E Test', () => {

    before(() => dropCollection('actors'));

    let actor1 = {
        name: 'John Krasinski',
        dob: new Date(1979, 9, 20),
        pob: 'Newton, MA'
    };

    let actor2 = {
        name: 'Aubrey Plaza',
        dob: new Date(1984, 5, 26),
        pob: 'Wilmington, DE'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('posts an actor to db', () => {
        return request.post('/actors')
            .send(actor1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, dob } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(dob);
                assert.deepEqual(body, {
                    ...actor1,
                    _id, __v, dob
                });
                actor1 = body;
            });
    });

    it('gets an actor by id', () => {
        return request.post('/actors')
            .send(actor2)
            .then(checkOk)
            .then(({ body }) => {
                actor2 = body;
                return request.get(`/actors/${actor2._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, actor2);
            });
    });

    const getFields = ({ _id, name }) => {
        return {
            _id, name
        };
    };

    it('gets all actors', () => {
        return request.get('/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [actor1, actor2].map(getFields));
            });
    });

    it('updates an actor', () => {
        actor2.name = 'Aubrey Christina Plaza';
        
        return request.put(`/actors/${actor2._id}`)
            .send(actor2)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, actor2);
                return request.get(`/actors/${actor2._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, actor2);
            });
    });

    it('removes an actor', () => {
        return request.delete(`/actors/${actor1._id}`)
            .then(() => {
                return request.get(`/actors/${actor1._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
});