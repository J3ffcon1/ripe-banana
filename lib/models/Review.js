const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredID = {
    type: Schema.Types.ObjectId,
    required: true

};

const reviewSchema = new Schema ({
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewer: RequiredID,
    review: { type: String, required: true, maxlength: 140 }, /*eslint-disable-line*/
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true,
    },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);