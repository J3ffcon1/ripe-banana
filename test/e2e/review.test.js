// const { assert } = require('chai');
// const request = require('./request');
// const { dropCollection } = require('./db');

// describe('Review E2E Test', () => {

//     before(() => dropCollection('reviews'));
//     before(() => dropCollection('films'));
//     before(() => dropCollection('reviewer'));

//     let film1 = {
//         name: 'A Quiet Place'
//     };

//     before(() => {
//         return request.post('/films')
//             .send(film1)
//             .then(({ body }) => {
//                 film1 = body;
//             });
//     });

//     let review1 = {
//         rating: 5,
//         reviewer
//     }
// });