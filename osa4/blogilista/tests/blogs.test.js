const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app');
const Blog = require('../models/blog')
const helper = require('./blogs-test-helper.js')
const api = supertest(app);

describe('controllers/blog', () => {
  describe('GET /api/blogs', () => {
    describe('when database has blogs', () => {
      let response

      beforeAll(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.blogList)
        response = await api.get('/api/blogs')
      })

      test('returns JSON', async () => {
        expect(response.status).toBe(200)
        expect(response.type).toBe('application/json')
      })

      // This test is kind of redundant because the next one would also fail if the number of returned blogs is incorrect
      test('returns correct number of blogs', async () => {
        expect(response.body).toHaveLength(helper.blogList.length)
      })

      test('returns all content in correct order', async () => {
        expect(response.body).toEqual(helper.JSONFormattedBlogList)
      })

      test("Blog id field doesn't have underscore", async () => {
        const blog = (await api.get('/api/blogs')).body[0]
        expect(blog.id).toBeDefined()
        expect(blog._id).not.toBeDefined()
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
      await Blog.deleteMany()
    })

    describe('can add single blog when database is empty', () => {
      let response
      let blogsInDB

      beforeAll(async () => {
        response = await api
          .post('/api/blogs')
          .send(helper.singleBlog)
        blogsInDB = await helper.getBlogsInDB()
      })

      test('returns added blog', () => {
        expect(response.status).toBe(201)
        expect(response.body).toStrictEqual(helper.JSONFormattedSingleBlog)
      })

      test('increases list length by one', () => {
        expect(blogsInDB.length).toBe(1)
      })

      test('adds correct data to database', () => {
        expect(blogsInDB).toEqual([helper.JSONFormattedSingleBlog])
      })
    })

    describe('can add single blog when database already has blogs', () => {
      let response
      let blogsInDB

      beforeAll(async () => {
        await Blog.insertMany(helper.blogList)

        response = await api
          .post('/api/blogs')
          .send(helper.singleBlog)

        blogsInDB = await helper.getBlogsInDB()
      })

      test('returns added blog', () => {
        expect(response.status).toBe(201)
        expect(response.body).toStrictEqual(helper.JSONFormattedSingleBlog)
      })

      test('increases list length by one', () => {
        expect(blogsInDB.length).toBe(helper.blogList.length + 1)
      })

      test('adds correct data to database', () => {
        expect(blogsInDB).toEqual([...helper.JSONFormattedBlogList, helper.JSONFormattedSingleBlog])
      })
    })

    describe('likes is set to 0 if it is undefined', () => {
      let response

      beforeAll(async () => {
        const { likes, ...noLikesBlog } = helper.singleBlog
        response = await api.post('/api/blogs').send(noLikesBlog)
      })

      test('returns added blog with zero likes', () => {
        const zeroLikesBlog = { ...helper.JSONFormattedSingleBlog, likes: 0 }
        expect(response.status).toBe(201)
        expect(response.body).toStrictEqual(zeroLikesBlog)
      })
    })

    describe('title and url are required', () => {
      test('responds with status 400 if title is undefined', async () => {
        const { title, ...noTitleBlog } = helper.singleBlog
        const response = await api.post('/api/blogs').send(noTitleBlog)
        expect(response.status).toBe(400)
      })

      test('responds with status 400 if url is undefined', async () => {
        const { url, ...noURLBlog } = helper.singleBlog
        const response = await api.post('/api/blogs').send(noURLBlog)
        expect(response.status).toBe(400)
      })

      test('responds with status 400 if both title and url are undefined', async () => {
        const { title, url, ...noTitleOrURLBlog } = helper.singleBlog
        const response = await api.post('/api/blogs').send(noTitleOrURLBlog)
        expect(response.status).toBe(400)
      })
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    describe("Given id is in valid format", () => {
      let singleId = helper.JSONFormattedSingleBlog.id

      beforeEach(async () => {
        await Blog.deleteMany({})
      })

      describe("Database has multiple blogs", () => {
        describe("Id exists", () => {
          let response
          let blogsInDB
          let initialBlogs = [...helper.blogList, helper.singleBlog]

          beforeAll(async () => {
            await Blog.insertMany(initialBlogs)
            response = await api.delete(`/api/blogs/${singleId}`)
            blogsInDB = await helper.getBlogsInDB()
          })

          test("Should respond with status 204", async () => {
            expect(response.status).toBe(204)
          })

          test("Should delete blog from database", () => {
            expect(blogsInDB).not.toContain(helper.singleBlog)
          })

          test("Number of blogs in DB should decrease by one", () => {
            expect(blogsInDB.length).toBe(initialBlogs.length - 1)
          })
        })

        describe("Id doesnt exist", () => {
          let response
          let blogsInDB
          let initialBlogs = [...helper.blogList]

          beforeAll(async () => {
            await Blog.insertMany(initialBlogs)
            response = await api.delete(`/api/blogs/${singleId}`)
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
          let initialBlogs = [helper.singleBlog]

          beforeAll(async () => {
            await Blog.insertMany(initialBlogs)
            response = await api.delete(`/api/blogs/${singleId}`)
            blogsInDB = await helper.getBlogsInDB()
          })

          test("Should respond with status 204", async () => {
            expect(response.status).toBe(204)
          })

          test("Should delete blog from database", () => {
            expect(blogsInDB).not.toContain(helper.singleBlog)
          })

          test("Number of blogs in DB should decrease by one", () => {
            expect(blogsInDB.length).toBe(initialBlogs.length - 1)
          })
        })

        describe("Id doesnt exist", () => {
          let response
          let blogsInDB
          let initialBlogs = []

          beforeAll(async () => {
            await Blog.insertMany(initialBlogs)
            response = await api.delete(`/api/blogs/${singleId}`)
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
    })

    test("It should respond with status 400 when id is invalid", async () => {
      let response = await api.delete('/api/blogs/thisisaninvalidid1234')
      expect(response.status).toBe(400)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    describe("When ID is in valid format", () => {
      let singleId = helper.JSONFormattedSingleBlog.id

      beforeEach(async () => {
        await Blog.deleteMany({})
      })

      describe("When ID exists", () => {
        let insertedBlogs
        let response
        let allBlogsInDB

        beforeAll(async () => {
          insertedBlogs = [...helper.blogList, helper.singleBlog]
          await Blog.insertMany(insertedBlogs)
          response = await api.put(`/api/blogs/${singleId}`).send(helper.modifiedSingleBlog)
          allBlogsInDB = (await helper.getBlogsInDB())  
        })
        test("Should respond with status 200", async () => expect(response.status).toBe(200))
        
        test("Should return modified blog", () => expect(response.body)
          .toStrictEqual(helper.JSONFormattedModifiedSingleBlog))
      
        test("Database should contain the modified blog and the other blogs but nothing else", async () => {
          expect(allBlogsInDB.sort())
            .toStrictEqual([...helper.JSONFormattedBlogList, helper.JSONFormattedModifiedSingleBlog].sort())
        })
      })

      describe("When ID doesn't exist", () => {
        let response
        let blogsInDB

        beforeAll(async () => {
          await Blog.insertMany(helper.blogList)
          response = await api.put(`/api/blogs/${singleId}`).send(helper.modifiedSingleBlog)          
          blogsInDB = await helper.getBlogsInDB()
        })

        test("Should respond with status 404", async () => expect(response.status).toBe(404))
        test("Number of blogs in DB shouldn't change", async () => {
          expect(blogsInDB.length)
            .toBe(helper.blogList.length)
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