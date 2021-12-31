const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app');
const createPasswordHash = require('../utils/createPasswordHash.js')
const User = require('../models/user.js')
const helper = require('./users-test-helper.js')

const api = supertest(app);


describe("POST /api/users", () => {
  describe("One existing user in DB", () => {
    let usersInDB

    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await createPasswordHash("salasana")

      await User.create({
        username: "user1",
        name: "Erkki",
        passwordHash
      })

      usersInDB = await helper.getUsersInDB()
    })

    test.skip("User creation fails when username already exists in DB", async () => {
      const newUser = {
        username: "user1",
        name: "Esimerkki",
        password: "uusisalasana"
      }

      const response = await api.post('/api/users/').send(newUser)

      expect(response.status).toBe(400)
      expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length)
    })

    test("User creation succeeds with new username", async () => {
      const newUser = {
        username: "user2",
        name: "Esimerkki",
        password: "uusisalasana"
      }

      const response = await api.post('/api/users/').send(newUser)

      expect(response.status).toBe(201)
      expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length + 1)
    })
  })
})

describe("GET /api/users", () => {
  beforeEach(() => User.deleteMany({}))

  describe("When DB is empty", () => {
    let response
    beforeEach(async () => {
      response = await api.get('/api/users')
    })

    test("Should respond with status 200", () => {
      expect(response.status).toBe(200)
    })

    test("Should respond with empty list", () => {
      expect(response.body).toHaveLength(0)
    })
  })

  describe("When DB has users", () => {
    let response
    let usersInDB
    let singleUser

    beforeEach(async () => {
      await User.insertMany(helper.usersDBFormat)
      response = await api.get('/api/users')
      usersInDB = await helper.getUsersInDB()
      singleUser = usersInDB[0]
    })

    test("Should respond with status 200", () => {
      expect(response.status).toBe(200)
    })

    test("Should return JSON", () => {
      expect(response.type).toBe('application/json')
    })

    test("Should return correct number of users", () => {
      expect(response.body).toHaveLength(helper.usersDBFormat.length)
    })

    test("Should return all content in correct order", () => {
      expect(response.body).toEqual(helper.usersPublicFormat)
    })

    test("User id field shouldn't have underscore", () => {
      expect(singleUser.id).toBeDefined()
      expect(singleUser._id).not.toBeDefined()
    })

    test("Password and passwordHash should not be defined", () => {
      expect(singleUser.password).not.toBeDefined()
      expect(singleUser.passwordHash).not.toBeDefined()
    })

    test("__v should not be defined", () => {
      expect(singleUser.__v).not.toBeDefined()
    })
  })
})

afterAll(() => mongoose.connection.close())