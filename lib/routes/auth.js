const router = require('express').Router();
const { respond } = require('./route-helpers');
const User = require('../models/User');

module.exports = router
    .post('/signup', respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            User.exists({ email }) //check to see if user exists (if they have an email signin).
                .then(exists => {
                    if(exists) {
                        throw { //return statement, so ends the function.
                            status: 400,
                            error: 'Email exists'
                        };
                    }

                    const user = new User(body);
                    user.generateHash(password);
                    return user.save(); //save that data(data that is within the model User). return as a promise.
                })
                .then(user => {
                    return { token: user._id };
                });
        }
    ))

    .post('/signin', respond(
        ({ body }) => {
            const { email, password } = body; //need to get email and password from the body. 
            delete body.password; //delete the password.

            return User.findOne({ email })
                .then(user => {
                    if(!user || !user.comparePassword(password)) {
                        throw {
                            status: 401,
                            error: ' Invalid email or password'
                        };
                   
                    }

                    return { token: user._id };

                });
        }
    ));