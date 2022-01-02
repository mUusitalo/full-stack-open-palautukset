require('express-async-errors')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


blogsRouter.get('/', async (req, res) => {
  res
    .json(await Blog.find({})
    .populate('user', {username: 1, name: 1, id: 1}))
})

blogsRouter.post('/', async (req, res) => {
  debugger
  const {_id: userID} = await User.findOne({}) // Later we'll get this from the token in req
  const blog = new Blog({...req.body, user: userID})
  const result = await blog.save()
  await User.findByIdAndUpdate(userID, {$push: {'blogs': result._id}})
  res.status(201).json(result)
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

module.exports = blogsRouter