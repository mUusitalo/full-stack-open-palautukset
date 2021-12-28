const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app');
const Blog = require('../models/blog')
const helper = require('./blog-api-test-helper')
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

        //describe('likes is set to 0 if it is undefined', () => {
        //    
        //})
    })
})

afterAll(() => {
    mongoose.connection.close()
})
