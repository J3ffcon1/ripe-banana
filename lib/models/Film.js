const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};
const RequiredID = {
    type: Schema.Types.ObjectId,
    required: true

};
const RequiredNumber = {
    type: Number,
    required: true
};

const filmSchema = new Schema({
    title: RequiredString,
    studio: RequiredID,
    released: RequiredNumber,
    cast:[{
        characterpart: RequiredString,
        actor: RequiredID
    }],


});

module.exports = mongoose.model('Film', filmSchema);