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

connectToDatabase()

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
module.exports = app;
