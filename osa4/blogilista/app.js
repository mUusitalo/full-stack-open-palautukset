const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { DB_URL } = require('./utils/config.js')
const blogsRouter = require('./controllers/blogs');
const log = require('./utils/log.js');

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        log.info('Connected to database!');
    } catch (e) {
        log.error('Could not connect to database!', e);
    }
}

function errorHandler(error, req, res, next) {
    log.error(error.message)

    switch(error.name) {
        case 'ValidationError':
            return res.status(400).json({error: error.message})
        case 'CastError':
            return res.status(400).json({error: `Invalid id: ${req.body.id}`})
        default:
            next(error)
    }
}

connectToDatabase()

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)
module.exports = app;
