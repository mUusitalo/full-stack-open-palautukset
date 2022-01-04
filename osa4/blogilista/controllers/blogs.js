require('express-async-errors')
const jwt = require('jsonwebtoken')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


blogsRouter.get('/', async (req, res) => {
  res
    .json(await Blog.find({})
    .populate('user', {username: 1, name: 1, id: 1}))
})

blogsRouter.post('/', async (req, res) => {
  const userID = getUserIDByToken(extractBearerToken(req))
  
  if (userID == null) {
    return res.status(401).json({error: "Invalid token"})
  }

  const blogResponse = await saveBlogToDBAndUpdateUser(req.body, userID)

  res.status(201).json(blogResponse)
})

blogsRouter.delete('/:id', async (req, res) => {
  const deletedBlog = await Blog.findByIdAndRemove(req.params.id)
  if (deletedBlog) {
    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const {_id, ...updatedData} = req.body
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, {new: true, runValidators: true})
  if (newBlog) res.status(200).json(newBlog)
  else res.status(404).end()
})

function extractBearerToken(request) {
  const authHeader = request.get('authorization')

  return authHeader?.toLowerCase().startsWith('bearer ')
    ? authHeader.substring(7)
    : null
}

function getUserIDByToken(token) {
  if (token == null) return null
  const decodedToken = jwt.verify(token, process.env.SECRET)
  return decodedToken?.id ?? null
}

async function saveBlogToDBAndUpdateUser(blogContent, userID) {
  const blog = new Blog({...blogContent, user: userID})
  const result = await blog.save()
  await User.findByIdAndUpdate(userID, {$push: {'blogs': result._id}})
  return result
}

module.exports = blogsRouter