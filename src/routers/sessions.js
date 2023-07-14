const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma.js')
const secret = process.env.JWT_SECRET

router.post('/', async (req, res) => {
  try {
    // Get the username and password from the request body
    const { username, password } = req.body

    // Check if a user with the given username exists in the database
    const findAcc = await prisma.user.findUnique({
      where: {
        username
      }
    })

    // If user does not exist or the password does not match, return a 401 error
    if (!findAcc) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Use bcrypt to check if the provided password matches the hashed password in the database
    bcrypt.compare(password, findAcc.password, (errro, result) => {
      if (!result) {
        return res.status(401).json({ error: 'Invalid username or password' })
      }

      // If the user exists and the passwords match, create a JWT containing the username in the payload
      const token = jwt.sign({ username }, secret)

      // Send a JSON object with a "token" key back to the client
      return res.status(201).json({ token })
    })
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router

module.exports = router
