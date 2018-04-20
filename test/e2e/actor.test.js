const { assert } = require('chai');
const request = required('./request');
const { dropCollection } = require('./db');

describe('Actor E2E Test', () => {

    let actor1 = {
        name: 'John Krasinski',
        dob: new Date(1979, 9, 20),
        pob: 'Newton, MA'
    };

    let actor2 = {
        name: 'Aubrey Plaza',
        dob: new Date(1984, 5, 26),
        pob: ''
    }



});