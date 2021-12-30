require('express-async-errors')

const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (req, res) => {
  res.json(await Blog.find({}))
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  res.status(201).json(await blog.save())
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