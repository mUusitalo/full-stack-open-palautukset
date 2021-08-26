const mongoose = require('mongoose');
const supertest = require('supertest')

const app = require('../app');
const Blog = require('../models/blog')
const helper = require('./blog-api-test-helper')
const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.testBlogList)
})

describe('controllers/blog', () => {
    describe('GET /api/blogs', () => {
        describe('when database has blogs', () => {
            let response

            beforeAll(async () => {
                response = await api.get('/api/blogs')
            })

            test('returns JSON', async () => {
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
            })
    
            // This test is kind of redundant because the next one would also fail if the number of returned blogs is incorrect
            test('returns correct number of blogs', async () => {
                expect(response.body).toHaveLength(helper.testBlogList.length)
            })
    
            test('returns all content in correct order', async () => {
                expect(response.body).toEqual(helper.testBlogListToJSONApplied)
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

        test("Blog id field doesn't have underscore", async () => {
            const blog = (await api.get('/api/blogs')).body[0]
            expect(blog.id).toBeDefined()
            expect(blog._id).not.toBeDefined()
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})