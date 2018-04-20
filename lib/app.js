const express = require('express');
const app = express();
const errorHandler = require('./util/error-handler');

app.use(express.json());

const actors = require('./routes/actor');
const films = require('./routes/film');
const reviews = require('./routes/review');
const reviewers = require('./routes/reviewer');
const studios = require('./routes/studio');

app.use('/actors', actors);
// app.use('/film', film);
// app.use('/review', review);
// app.use('/reviewer', reviewer);
// app.use('/studio', studio);

app.use(errorHandler());

module.exports = app;