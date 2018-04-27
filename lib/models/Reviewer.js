const mongoose = require('mongoose');
const { Schema } = mongoose;
const RequiredString = require('./required-types');
const bcrypt = require('bcryptjs');

const reviewerSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    company: { 
        type: String, 
        required: true 
    },
    email:RequiredString,
    hash: RequiredString,
    roles: [String] //mongoose and mongodb preffered. in how its visualized. 
});

Schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.createHash(password, 8);
    },
    companyPassword(password) {
        this.hash = bcrypt.compareSync(password, this.hash);
    }
};

module.exports = mongoose.model('Reviewer', reviewerSchema);