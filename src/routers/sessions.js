const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma.js')
const secret = process.env.JWT_SECRET

router.post('/', async (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body
  // Check that a user with that username exists in the database
  const findAcc = await prisma.user.findUnique({
    where: {
      username
    }
  })
  if (!findAcc) {
    res.status(404).json({ error: 'Invalid username or password' })
  }
  // Use bcrypt to check that the provided password matches the hashed password on the user
  bcrypt.compare(password, findAcc.password, (err, result) => {
    if (!result) {
      res.status(401).json({ erros: 'Invalid username or password' })
    } else {
      const token = jwt.sign({ username }, secret)
      res.status(201).json({ token })
    }
  })
  // If either of these checks fail, respond with a 401 "Invalid username or password" error

  // If the user exists and the passwords match, create a JWT containing the username in the payload
  // Use the JWT_SECRET environment variable for the secret key

  // Send a JSON object with a "token" key back to the client, the value is the JWT created
})

module.exports = router
