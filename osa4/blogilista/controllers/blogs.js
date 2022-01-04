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
  const userID = getUserIDByToken(req.token)

  const blogResponse = await saveBlogToDBAndUpdateUser(req.body, userID)

  res.status(201).json(blogResponse)
})

blogsRouter.delete('/:id', async (req, res) => {
  const userID = getUserIDByToken(req.token)
  const blogToBeDeleted = await Blog.findById(req.params.id)

  if (!blogToBeDeleted) {return res.status(404).send()}

  if (blogToBeDeleted.user.toString() !== userID.toString()) {
    throw new jwt.JsonWebTokenError("Token does not match the blog's user")
  }

  await blogToBeDeleted.delete()
  res.status(204).send()
  
})

blogsRouter.put('/:id', async (req, res) => {
  const {_id, ...updatedData} = req.body
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, {new: true, runValidators: true})
  if (newBlog) res.status(200).json(newBlog)
  else res.status(404).end()
})

function getUserIDByToken(token) {
  const {id} = jwt.verify(token, process.env.SECRET)
  if (id == null) throw new jwt.JsonWebTokenError('No id found in token')
  return id
}

async function saveBlogToDBAndUpdateUser(blogContent, userID) {
  const blog = new Blog({...blogContent, user: userID})
  const result = await blog.save()
  await User.findByIdAndUpdate(userID, {$push: {'blogs': result._id}})
  return result
}

module.exports = blogsRouter