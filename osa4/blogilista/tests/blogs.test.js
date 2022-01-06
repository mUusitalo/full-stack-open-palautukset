const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app.js');
const Blog = require('../models/blog.js')
const {SECRET} = require('../utils/config.js')
const helper = require('./blogs-test-helper.js')
const User = require('../models/user.js')

const api = supertest(app);

describe('controllers/blog', () => {
  let token
  beforeEach(async () => {
    await Promise.all([Blog.deleteMany({}), User.deleteMany({})]) // Wipe database
    await User.insertMany(Object.values(helper.user))
    token = {
      correct: jwt.sign({username: helper.user.correct.username, id: helper.user.correct._id}, SECRET),
      incorrect: jwt.sign({username: helper.user.incorrect.username, id: helper.user.incorrect._id}, SECRET),
      invalid: "qwertyuiop"
    } 
  })

  describe('GET /api/blogs', () => {
    describe('when database has blogs', () => {
      let response
      let singleBlog

      beforeEach(async () => {
        await Blog.insertMany(helper.blogs.DBFormat)
        response = await api.get('/api/blogs')
        singleBlog = response.body[0]
      })

      test('Returns JSON', async () => {
        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
      })

      // This test is kind of redundant because the next one would also fail if the number of returned blogs is incorrect
      test('Returns correct number of blogs', async () => {
        expect(response.body).toHaveLength(helper.blogs.DBFormat.length)
      })

      test('Returns all content in correct order', async () => {
        expect(response.body).toEqual(helper.blogs.populated)
      })

      test('Blog user field is populated', async () => {
        expect(singleBlog.user).toEqual(helper.blogs.populated[0].user)
      })

      test("Blog id field doesn't have underscore", async () => {
        expect(singleBlog.id).toBeDefined()
        expect(singleBlog._id).not.toBeDefined()
      })
    })

    describe('when database is empty', () => {
      let response

      beforeAll(async () => {
        await Blog.deleteMany({})
        response = await api.get('/api/blogs')
      })

      test('returns JSON', async () => {
        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
      })

      test('returns an empty array', async () => {
        expect(response.body).toHaveLength(0)
      })
    })
  })

  describe('POST /api/blogs', () => {
    beforeEach(async () => {
    })

    describe('can add single blog when database is empty', () => {
      let response
      let blogsInDB

      beforeEach(async () => {
        response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(helper.singleBlog.DBFormat)
        blogsInDB = await helper.getBlogsInDB()
      })

      test('returns added blog', () => {
        expect(response.status).toBe(201)
        expect(response.body).toStrictEqual(helper.singleBlog.JSONFormat)
      })

      test('increases list length by one', () => {
        expect(blogsInDB.length).toBe(1)
      })

      test('adds correct data to database', async () => {
        expect(blogsInDB).toEqual([helper.singleBlog.JSONFormat])
      })
    })

    describe('can add single blog when database already has blogs', () => {
      let response
      let blogsInDB

      beforeEach(async () => {
        await Blog.insertMany(helper.blogs.DBFormat)

        response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(helper.singleBlog.DBFormat)

        blogsInDB = await helper.getBlogsInDB()
      })

      test('returns added blog', () => {
        expect(response.status).toBe(201)
        expect(response.body).toStrictEqual(helper.singleBlog.JSONFormat)
      })

      test('increases list length by one', () => {
        expect(blogsInDB.length).toBe(helper.blogs.DBFormat.length + 1)
      })

      test('adds correct data to database', () => {
        expect(blogsInDB).toEqual([...helper.blogs.JSONFormat, helper.singleBlog.JSONFormat])
      })
    })

    describe("Validation", () => {
      describe('likes is set to 0 if it is undefined', () => {
        let response
        
        beforeEach(async () => {
          const { likes, ...noLikesBlog } = helper.singleBlog.DBFormat
          response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(noLikesBlog)
        })
        
        test('returns added blog with zero likes', () => {
          const zeroLikesBlog = { ...helper.singleBlog.JSONFormat, likes: 0 }
          expect(response.status).toBe(201)
          expect(response.body).toStrictEqual(zeroLikesBlog)
        })
      })
      
      describe('title and url are required', () => {
        test('responds with status 400 if title is undefined', async () => {
          const { title, ...noTitleBlog } = helper.singleBlog.DBFormat
          const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(noTitleBlog)
          expect(response.status).toBe(400)
        })
        
        test('responds with status 400 if url is undefined', async () => {
          const { url, ...noURLBlog } = helper.singleBlog.DBFormat
          const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(noURLBlog)
          expect(response.status).toBe(400)
        })
        
        test('responds with status 400 if both title and url are undefined', async () => {
          const { title, url, ...noTitleOrURLBlog } = helper.singleBlog.DBFormat
          const response = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token.correct}`)
          .send(noTitleOrURLBlog)
          expect(response.status).toBe(400)
        })
      })

      describe("Token validity", () => {
        test("Fails if Authorization header is undefined", async () => {
          response = await api
            .post('/api/blogs')
            .send(helper.singleBlog.DBFormat)
          
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
        })

        test("Fails if Authorization header is blank", async () => {
          response = await api
            .post('/api/blogs')
            .set('Authorization', '')
            .send(helper.singleBlog.DBFormat)
          
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
        })

        test("Fails if token is blank", async () => {
          response = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ')
            .send(helper.singleBlog.DBFormat)
          
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
        })

        test("Fails if token is invalid", async () => {
          response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token.invalid}`)
            .send(helper.singleBlog.DBFormat)
          
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
        })

        test("Succeeds if token is valid", async () => {
          response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token.correct}`)
            .send(helper.singleBlog.DBFormat)
          
          expect(response.status).toBe(201)
          expect(response.body.error).not.toBeDefined()
        })
      })
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    let singleId = helper.singleBlog.JSONFormat.id
    
    describe("Database has multiple blogs", () => {
      describe("Id exists", () => {
        let response
        let blogsInDB
        let initialBlogs = [...helper.blogs.DBFormat, helper.singleBlog.DBFormat]

        beforeEach(async () => {
          await Blog.insertMany(initialBlogs)
          response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.correct}`)
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 204", async () => {
          expect(response.status).toBe(204)
        })

        test("Should delete blog from database", () => {
          expect(blogsInDB).not.toContainEqual(helper.singleBlog.DBFormat)
        })

        test("Number of blogs in DB should decrease by one", () => {
          expect(blogsInDB.length).toBe(initialBlogs.length - 1)
        })
      })

      describe("Id doesnt exist", () => {
        let response
        let blogsInDB
        let initialBlogs = [...helper.blogs.DBFormat]

        beforeEach(async () => {
          await Blog.insertMany(initialBlogs)
          response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.correct}`)
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 404", async () => {
          expect(response.status).toBe(404)
        })

        test("Number of blogs in DB shouldn't change", () => {
          expect(blogsInDB.length).toBe(initialBlogs.length)
        })
      })
    })

    describe("Database has 1 or 0 blogs", () => {
      describe("Id exists", () => {
        let response
        let blogsInDB
        let initialBlogs = [helper.singleBlog.DBFormat]

        beforeEach(async () => {
          await Blog.insertMany(initialBlogs)
          response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.correct}`)
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 204", async () => {
          expect(response.status).toBe(204)
        })

        test("Should delete blog from database", () => {
          expect(blogsInDB).not.toContainEqual(helper.singleBlog.DBFormat)
        })

        test("Number of blogs in DB should decrease by one", () => {
          expect(blogsInDB.length).toBe(initialBlogs.length - 1)
        })
      })

      describe("Id doesnt exist", () => {
        let response
        let blogsInDB
        let initialBlogs = []

        beforeEach(async () => {
          await Blog.insertMany(initialBlogs)
          response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.correct}`)
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 404", async () => {
          expect(response.status).toBe(404)
        })

        test("Number of blogs in DB shouldn't change", () => {
          expect(blogsInDB.length).toBe(initialBlogs.length)
        })
      })
    })

    describe("Validation", () => {
      describe("Token", () => {
        beforeEach(async () => {
          await Blog.create(helper.singleBlog.DBFormat)
        })

        test("Should fail when token is invalid", async () => {
          const response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.invalid}`)
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
          expect((await helper.getBlogsInDB())).toContainEqual(helper.singleBlog.JSONFormat)
        })

        test("Should fail when authorization header is missing", async () => {
          const response = await api
            .delete(`/api/blogs/${singleId}`)
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
          expect((await helper.getBlogsInDB())).toContainEqual(helper.singleBlog.JSONFormat)
        })

        test("Should fail when token is invalid", async () => {
          const response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.incorrect}`)
          expect(response.status).toBe(401)
          expect(response.body.error).toBeDefined()
          expect(response.body.error.toLowerCase()).toContain("invalid token")
          expect((await helper.getBlogsInDB())).toContainEqual(helper.singleBlog.JSONFormat)
        })

        test("Should succeed when token is valid", async () => {
          const response = await api
            .delete(`/api/blogs/${singleId}`)
            .set('Authorization', `bearer ${token.correct}`)
          expect(response.status).toBe(204)
          expect((await helper.getBlogsInDB())).not.toContainEqual(helper.singleBlog.JSONFormat)
        })
      })

      test("It should respond with status 400 when id is invalid", async () => {
        let response = await api
          .delete('/api/blogs/thisisaninvalidid1234')
          .set('Authorization', `bearer ${token.correct}`)
        expect(response.status).toBe(400)
      })
    })
  })

  describe('PUT /api/blogs/:id', () => {
    describe("When ID is in valid format", () => {
      let singleId = helper.singleBlog.JSONFormat.id

      beforeEach(async () => {
        await Blog.deleteMany({})
      })

      describe("When ID exists", () => {
        let insertedBlogs
        let response
        let allBlogsInDB

        beforeAll(async () => {
          insertedBlogs = [...helper.blogs.DBFormat, helper.singleBlog.DBFormat]
          await Blog.insertMany(insertedBlogs)
          response = await api.put(`/api/blogs/${singleId}`).send(helper.modifiedSingleBlog.DBFormat)
          allBlogsInDB = (await helper.getBlogsInDB())  
        })
        test("Should respond with status 200", async () => expect(response.status).toBe(200))
        
        test("Should return modified blog", () => expect(response.body)
          .toStrictEqual(helper.modifiedSingleBlog.JSONFormat))
      
        test("Database should contain the modified blog and the other blogs but nothing else", async () => {
          expect(allBlogsInDB.sort())
            .toStrictEqual([...helper.blogs.JSONFormat, helper.modifiedSingleBlog.JSONFormat].sort())
        })
      })

      describe("When ID doesn't exist", () => {
        let response
        let blogsInDB

        beforeAll(async () => {
          await Blog.insertMany(helper.blogs.DBFormat)
          response = await api.put(`/api/blogs/${singleId}`).send(helper.modifiedSingleBlog.DBFormat)          
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 404", async () => expect(response.status).toBe(404))
        test("Number of blogs in DB shouldn't change", async () => {
          expect(blogsInDB.length)
            .toBe(helper.blogs.DBFormat.length)
        })
      })
    })

    test("If ID format is invalid respond with status 400", async () => {
      let response = await api.put('/api/blogs/thisisaninvalidid1234')
      expect(response.status).toBe(400)
    })
  })
})

afterAll(() => mongoose.connection.close())