const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const event = require('./routes/event');
const venue = require('./routes/venue');
const categories = require('./routes/category');
const auth = require('./routes/auth');
const post = require('./routes/post');
const video = require('./routes/video');
const forum = require('./routes/forum');
const vent = require('./routes/vent');
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());



// Use the imported routes modules
app.use('/api', forum);
// app.use('/api', event);
app.use('/api', venue);
app.use('/api', categories);
app.use('/api', auth);
app.use('/api', post);
app.use('/api', video);
app.use('/api', vent);
module.exports = app;