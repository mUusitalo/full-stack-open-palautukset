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

        describe('likes is set to 0 if it is undefined', () => {
            let response

            beforeAll(async () => {
                const {likes, ...noLikesBlog} = helper.singleBlog
                response = await api.post('/api/blogs').send(noLikesBlog)
            })

            test('returns added blog with zero likes', () => {
                const zeroLikesBlog = {...helper.JSONFormattedSingleBlog, likes: 0}
                expect(response.status).toBe(201)
                expect(response.body).toStrictEqual(zeroLikesBlog)
            })
        })

        describe('title and url are required', () => {
            test('responds with status 400 if title is undefined', async () => {
                const {title, ...noTitleBlog} = helper.singleBlog
                const response = await api.post('/api/blogs').send(noTitleBlog)
                expect(response.status).toBe(400)
            })

            test('responds with status 400 if url is undefined', async () => {
                const {url, ...noURLBlog} = helper.singleBlog
                const response = await api.post('/api/blogs').send(noURLBlog)
                expect(response.status).toBe(400)
            })

            test('responds with status 400 if both title and url are undefined', async () => {
                const {title, url, ...noTitleOrURLBlog} = helper.singleBlog
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
                test("Should respond with status 204 and return deleted blog when id exists", async () => {
                    await Blog.insertMany([...helper.blogList, helper.singleBlog])
                    let response = await api.delete(`/api/blogs/${singleId}`)
                    expect(response.status).toBe(204)
                })

                test("Should respond with status 404 when id doesn't exist", async () => {
                    await Blog.insertMany(helper.blogList)
                    let response = await api.delete(`/api/blogs/${singleId}`)
                    expect(response.status).toBe(404)
                })
            })

            describe("Database only has one or no blogs", () => {
                test("Should respond with status 204 when id exists", async () => {
                    await Blog.create(helper.singleBlog)
                    let response = await api.delete(`/api/blogs/${singleId}`)
                    expect(response.status).toBe(204)
                })

                test("Should respond with status 404 when id doesn't exist", async () => {
                    let response = await api.delete(`/api/blogs/${singleId}`)
                    expect(response.status).toBe(404)
                })
            })
        })

        test("It should respond with status 400 when id is invalid", async () => {
            let response = await api.delete('/api/blogs/thisisaninvalidid1234')
            expect(response.status).toBe(400)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})