const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Reviewer API', () => {

    before(() => dropCollection('reviewers'));

    let ebert = {
        name: 'Roger Ebert',
        company: 'RogerEbert.com'
    };

    let dana = {
        name: 'Dana Stevens',
        company: 'Slate'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
 
    it('posts a reviewer to db', () => {
        return request.post('/reviewers')
            .send(ebert)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, name } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(name);
                assert.deepEqual(body, {
                    ...ebert,
                    _id, __v, name
                });
                ebert = body;
            });
    });

    it('gets a reviewer by id', () => {
        return request.post('/reviewers')
            .send(dana)
            .then(checkOk)
            .then(({ body }) => {
                dana = body;
                return request.get(`/reviewers/${dana._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, dana);
            });
    });
    
    it('update a reviewer', () => {
        dana.name = 'Dana Shawn Stevens';

        return request.put(`/reviewers/${dana._id}`)
            .send(dana)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, dana);
                return request.get(`/reviewers/${dana._id}`);
            })
            .then(({ body }) => {
                assert.equal(body.name, dana.name);
            });
    });
  
});

