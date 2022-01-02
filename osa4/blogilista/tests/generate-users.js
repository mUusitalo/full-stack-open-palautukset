// Tool for creating testing data.

const faker = require('faker');
const fs = require('fs')
const mongoose = require('mongoose')

const {createPasswordHash} = require('../utils/user-authentication-utils.js')

async function generateFakeUsers(userCount) {
  const users = {
    DBFormat: [],
    passwordFormat: [],
    publicFormat: [],
  }

  for (let i = 1; i <= userCount; i++) {
    const name = faker.name.firstName()
    const username = faker.internet.userName(name)
    const password = faker.internet.password()
    const passwordHash = await createPasswordHash(password)
    const _id = mongoose.Types.ObjectId()
    const __v = 0

    users.DBFormat.push({name, username, passwordHash, _id, __v})
    users.passwordFormat.push({name, username, password})
    users.publicFormat.push({name, username, id: _id})
  }
  
  console.log(users)
}

generateFakeUsers(5)