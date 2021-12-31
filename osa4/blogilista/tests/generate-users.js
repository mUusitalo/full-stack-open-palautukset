// Tool for creating testing data.

const faker = require('faker');
const fs = require('fs')
const mongoose = require('mongoose')

const createPasswordHash = require('../utils/createPasswordHash.js')

async function generateFakeUsers(userCount) {
  const users = []

  for (let i=1; i <= userCount; i++) {
    const name = faker.name.firstName()
    const username = faker.internet.userName(name)
    const passwordHash = await createPasswordHash(faker.internet.password())
    const _id = mongoose.Types.ObjectId()
    const __v = 0

    users.push({name, username, passwordHash, _id, __v})
  }
  
  console.log(users)
}

generateFakeUsers(5)