const bcrypt = require('bcryptjs')

async function createPasswordHash(password) {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

module.exports = createPasswordHash