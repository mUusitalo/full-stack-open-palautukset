const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const { DB_URL, NODE_ENV } = require('./utils/config.js')
const blogsRouter = require('./controllers/blogs.js')
const log = require('./utils/log.js');
const loginRouter = require('./controllers/login.js')
const usersRouter = require('./controllers/users.js')

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        log.info('Connected to database!');
    } catch (e) {
        log.error('Could not connect to database!', e);
    }
}

function errorHandler(error, req, res, next) {
    log.error({message: error.message, token: req.token})
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

function tokenExtractor(req, res, next) {
    const authHeader = req.get('Authorization')
  
    const token = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.substring(7)
      : null

    req.token = token
    next()
}

connectToDatabase()

const app = express();
app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
// userExtractor is defined and used in controllers/blogs.js
app.use('/api/blogs', blogsRouter)

// Testing utility routes:
if (NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing.js')
    app.use('/api/testing', testingRouter)
}

app.use(errorHandler)


module.exports = app;
