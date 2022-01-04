const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { DB_URL } = require('./utils/config.js')
const blogsRouter = require('./controllers/blogs.js')
const loginRouter = require('./controllers/login.js')
const usersRouter = require('./controllers/users.js')
const log = require('./utils/log.js');

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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
        case 'JsonWebTokenError':
            return res.status(401).json({error: 'Invalid token'})
        default:
            next(error)
    }
}

connectToDatabase()

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)
module.exports = app;
