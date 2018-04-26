const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const { RequiredString } = require('./required-types');

const schema = new Schema ({
    email: RequiredString, //email as user input
    hash: RequiredString //password or our encrypted password hash.

});

//using bcrypt to hash our passwords.
//bcrypt.hashSync('password', salt-rounds);
//bcrypt.comapreSync('inputed password', 'hashed-password') // returns a boolean.

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);    //this.hash will refer back to our user test. we are using bcrypt to hash password.
    },
    comparePassword(password){
        return bcrypt.compareSync(password, this.hash); //compares password with generated hash, (we got the hash from the generateHash())
    }
};

module.exports = mongoose.model('User', schema);