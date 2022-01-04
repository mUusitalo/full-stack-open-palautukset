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

blogsRouter.post('/', userExtractor, async (req, res) => {
  const blogResponse = await saveBlogToDBAndUpdateUser(req.body, req.user)
  res.status(201).json(blogResponse)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blogToBeDeleted = await Blog.findById(req.params.id)

  if (!blogToBeDeleted) {return res.status(404).send()}

  if (blogToBeDeleted.user.toString() !== req.user.toString()) {
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

function userExtractor(req, res, next) {
  const {id} = jwt.verify(req.token, process.env.SECRET)
  if (!id) {throw new jwt.JsonWebTokenError('No id found in token')}
  req.user = id
  next()
}

async function saveBlogToDBAndUpdateUser(blogContent, userID) {
  const blog = new Blog({...blogContent, user: userID})
  const result = await blog.save()
  await User.findByIdAndUpdate(userID, {$push: {'blogs': result._id}})
  return result
}

module.exports = blogsRouter