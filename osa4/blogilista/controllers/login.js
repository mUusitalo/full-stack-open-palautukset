const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const loginRouter = require('express').Router()
const User = require('../models/user.js')
const {SECRET} = require('../utils/config.js')

loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body
    const {passwordHash, name, _id: id} = await User.findOne({username}) ?? {}
    
    if (await isCorrectPassword(password, passwordHash)) {
        respondWithToken(res, {username, name, id})
    } else {
        respondWithError(res)
    }
})

function respondWithToken(response, {username, name, id}){
    const token = jwt.sign({username, id}, SECRET)
    response
        .status(200)
        .send({token, username, name})
}

function respondWithError(response){
    response
        .status(401)
        .send({error: "Invalid username or password"})
}

async function isCorrectPassword(password, passwordHash) {
    return (
        password != null
        && passwordHash != null
        && bcrypt.compare(password, passwordHash)
    )    
}

module.exports = loginRouter