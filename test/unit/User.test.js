const { assert } = require('chai');
const User = require('../../lib/models/User');

describe('User model', () => {

    const data = {
        email: 'me@me.com'
    };

    const password = 'abc';
    let user = null;
    
    beforeEach(() =>{
        user = new User(data); //establishes new instance of our User model
        user.generateHash(password); //generates a hash using the password. (using bcrypt in our model.)
    });

    it('generates hash from password', () =>{ //is this an actual token generated.    
        assert.ok(user.hash); //hash is a generated string of random characters. hashing is the act of converting those passwords to unreadable strings.
        assert.notEqual(user.hash, password); //this is saying that the hash should not be the same as the password. 


    });

    it('compares password to hash', () => {
        assert.isOk(user.comparePassword(password)); //compare this user password to a hash value. (we want to check if this password is the same as the hash).


    });


});