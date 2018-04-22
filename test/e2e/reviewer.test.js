const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Reviewer API', () => {

    before(() => dropCollection('reviewer'));

    let ebert = {
        name: 'Roger Ebert',
        company: 'RogerEbert.com'
    };

    // let dana = {
    //     name: 'Dana Stevens',
    //     company: 'Slate'
    // };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
    // before(() => {
    //     return request.post('/movies')
    //         .send(ebert)
    //         .then(({ body }) => {
    //             ebert = body;
    //         });
    it('posts a reviewer to db', () => {
        return request.post('/reviewer')
            .send(ebert)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, _v, name } = body;
                assert.ok(_id);
                assert.equal(_v, 0);
                assert.ok(name);
                assert.deepEqual(body, {
                    ...ebert,
                    _id, _v, name
                });
                ebert = body;
            });
    });

});

