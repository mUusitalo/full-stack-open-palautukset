const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app');
const User = require('../models/user.js')
const helper = require('./users-test-helper.js')

const api = supertest(app);


describe("POST /api/users", () => {
  describe("One existing user in DB", () => {
    let usersInDB

    beforeEach(async () => {
      await User.deleteMany({})

      await User.create(helper.users.DBFormat[0])

      usersInDB = await helper.getUsersInDB()
    })

    test("User creation succeeds with new username and valid data", async () => {
      const newUser = {...helper.users.passwordFormat[1]}
      const response = await api.post('/api/users/').send(newUser)
      const newUsersInDB = await helper.getUsersInDB()      
      const {id, ...JSONFormatNoID} = helper.users.JSONFormat[1]

      expect(response.status).toBe(201)
      expect(newUsersInDB).toHaveLength(usersInDB.length + 1)
      expect(newUsersInDB).toEqual(
        expect.arrayContaining([
          expect.objectContaining(JSONFormatNoID)
        ]))
    })

    describe("Validation", () => {
      describe("Username", () => {
        test("User creation fails when username already exists in DB", async () => {
          const newUser = {...helper.users.passwordFormat[0]}
          const response = await api.post('/api/users/').send(newUser)
          const newUsersInDB = await helper.getUsersInDB()
          const {id, ...JSONFormatNoID} = helper.users.JSONFormat[0]

          expect(response.status).toBe(400)
          expect(response.error).toBeDefined()
          expect(newUsersInDB).toHaveLength(usersInDB.length)
        })

        test("User creation fails when username is undefined", async () => {
          const newUser = {
            name: "Esimerkki",
            password: "uusisalasana"
          }
    
          const response = await api.post('/api/users/').send(newUser)
    
          expect(response.status).toBe(400)
          expect(response.body.error).toBeDefined()
          expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length)
        })

        test("User creation fails when length of username is under 3 characters", async () => {
          const newUser = {
            username: "Aa",
            name: "Esimerkki",
            password: "uusisalasana"
          }
    
          const response = await api.post('/api/users/').send(newUser)
    
          expect(response.status).toBe(400)
          expect(response.body.error).toContain('3') // Don't really care about the specifics of the message as long as it mentions the minimum length
          expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length)
        })
      })

      describe("Password", () => {
        test("User creation fails when password is undefined", async () => {
          const newUser = {
            username: "user2",
            name: "Esimerkki",
          }
          const response = await api.post('/api/users/').send(newUser)
    
          expect(response.status).toBe(400)
          expect(response.body.error).toBeDefined()
          expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length)
        })

        test("User creation fails when length of password is under 3 characters", async () => {
          const newUser = {
            username: "user2",
            name: "Esimerkki",
            password: "aa"
          }
    
          const response = await api.post('/api/users/').send(newUser)
    
          expect(response.status).toBe(400)
          expect(response.body.error).toContain('3') // Don't really care about the specifics of the message as long as it mentions the minimum length
          expect(await helper.getUsersInDB()).toHaveLength(usersInDB.length)
        })
      })
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
      await User.insertMany(helper.users.DBFormat)
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
      expect(response.body).toHaveLength(helper.users.DBFormat.length)
    })

    test("Should return all content in correct order", () => {
      expect(response.body.sort()).toEqual(helper.users.JSONFormat.sort())
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