const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('Auth API', () => {

    beforeEach(() => dropCollection('users')); //drop collections and begin with sign-in and sign-up.

    let token = null;

    beforeEach(() => {
        return request
            .post('/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('signin', () =>{
        return request  
            .post('/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(({ body }) => {
                assert.ok(body.token, token); //should be able to sign in with our generated token.
            });
    });

    it('Gives 400 on signup of same email', () =>{ //test to make sure someone who signs up with already in use email returns 400.
        return request
            .post('/auth/signup')
            .send({
                email: 'me@me.com', //same email we used above.
                password: 'abc'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email exists'); //you can't use that email you gave because it already exists.
            });
    });
});