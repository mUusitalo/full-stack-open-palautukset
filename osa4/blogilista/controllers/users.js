require('express-async-errors')
const usersRouter = require('express').Router()

const createPasswordHash = require('../utils/createPasswordHash.js')
const User = require('../models/user.js')

usersRouter.get('/', async (req, res) => {
  res.json(await User.find({}))
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await createPasswordHash(password)
  const user = new User({username, name, passwordHash})

  res.status(201).json(await user.save())
})

module.exports = usersRouter