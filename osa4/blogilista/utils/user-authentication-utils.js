const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

async function createPasswordHash(password) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

function validatePassword(password) {
    const minimumLength = 3
    if (typeof(password) !== 'string' || password.length < minimumLength) {
        const err = new mongoose.Error.ValidationError()
        err.addError('password', new mongoose.Error.ValidatorError({message: 'Password must be at least 3 characters long'}))
        throw err
    }
}

module.exports = {
    createPasswordHash,
    validatePassword
}