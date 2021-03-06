require('express-async-errors')
const usersRouter = require('express').Router()

const { createPasswordHash, validatePassword } = require('../utils/user-authentication-utils.js')
const User = require('../models/user.js')

usersRouter.get('/', async (req, res) => {
  const populated = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})
  res.json(populated)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  validatePassword(password)
  const passwordHash = await createPasswordHash(password)
  const user = new User({username, name, passwordHash})

  res.status(201).json(await user.save())
})

module.exports = usersRouter