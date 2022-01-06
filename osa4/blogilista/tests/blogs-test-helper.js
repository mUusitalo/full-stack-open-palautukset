const Blog = require('../models/blog.js')
const usersTestHelper = require('./users-test-helper.js')

const user = {
  correct: usersTestHelper.users.DBFormat[0],
  incorrect: usersTestHelper.users.DBFormat[1],
}

const blogs = {
  DBFormat: [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
      user: user.correct._id
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
      user: user.correct._id
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
      user: user.correct._id
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
      user: user.correct._id
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
      user: user.correct._id
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
      user: user.correct._id
    }
  ],
}
blogs.JSONFormat = blogs.DBFormat.map(createJSONFormattedBlog)
blogs.populated = blogs.JSONFormat.map(populateJSONBlog)
Object.freeze(blogs)

singleBlog = {
  DBFormat: {
    _id: "6127851c7889f74284719a0a",
    title: "The cost of JavaScript in 2019",
    author: "Addy Osmani",
    url: "https://v8.dev/blog/cost-of-javascript-2019",
    likes: 2,
    __v: 0,
    user: user.correct._id
  },
}
singleBlog.JSONFormat = createJSONFormattedBlog(singleBlog.DBFormat)
singleBlog.populated = populateJSONBlog(singleBlog.JSONFormat)
Object.freeze(singleBlog)

modifiedSingleBlog = {
  DBFormat: {
    _id: singleBlog.DBFormat._id,
    title: "Modified title",
    author: "Unnamed",
    url: "someurl",
    likes: 3,
    __v: 0,
    user: singleBlog.DBFormat.user
  },
}
modifiedSingleBlog.JSONFormat = createJSONFormattedBlog(modifiedSingleBlog.DBFormat)
modifiedSingleBlog.populated = populateJSONBlog(modifiedSingleBlog.JSONFormat)
Object.freeze(modifiedSingleBlog)

function createJSONFormattedBlog(blog) {
  const newBlog = { ...blog }
  newBlog.id = newBlog._id
  delete newBlog._id
  delete newBlog.__v
  return newBlog
}

function populateJSONBlog(blog) {
  const newBlog = { ...blog}
  const {blogs, ...noBlogs} = usersTestHelper.users.JSONFormat.find(user => user.id === newBlog.user)
  newBlog.user = noBlogs
  return newBlog
}

async function getBlogsInDB() {
  return (await Blog.find({})).map(blog => blog.toJSON())
}

async function getBlogFromDBByID(id) {
  const foundblog = (await Blog.findById(id)).toJSON()
  return foundblog
}

module.exports = {
  blogs,
  singleBlog,
  modifiedSingleBlog,
  user,
  getBlogsInDB,
  getBlogFromDBByID,
}
