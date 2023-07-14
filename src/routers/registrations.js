const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma.js')
const saltRounds = 10
// Get the username and password from request body

// Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body
    const hash = await bcrypt.hash(password, saltRounds)
    // Save the user using the prisma user model, setting their password to the hashed version
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hash
      }
    })
    delete newUser.password
    // Respond back to the client with the created users username and id
    res.status(201).json({ user: newUser })
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(403).json({ error: `The username is already taken!` })
    } else {
      res.status(500).json({ error })
    }
  }
})

router.get('/', async (req, res) => {
  const all = await prisma.user.findMany({})
  res.status(200).json({ users: all })
})
module.exports = router
