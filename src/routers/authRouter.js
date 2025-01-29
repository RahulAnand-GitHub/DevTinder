const express = require('express')
const authRouter = express.Router()

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { validateSignUpData } = require('../utils/validation')
const validator = require('validator')

authRouter.post('/signup', async (req, res) => {
  try {
    // Data validation
    validateSignUpData(req)

    const { firstName, lastName, email, password, age, about, skills } = req.body
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      about,
      skills,
    })
    await user.save()
    res.send('User added successfully.')
  } catch (err) {
    res.status(400).send(`ERROR: ${err}`)
  }
})
//login Api
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!validator.isEmail(email)) {
      throw new Error('Not a valid email')
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      throw new Error(`Invalid Credentials`)
    }

    const isValidPassword = await user.validatePassword(password)
    if (isValidPassword) {
      //create jwt token
      const token = await user.getJWT()

      //Add the token to cookie and send back the response back to the user
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 3600000),
      })
      res.send('Login Successful!!!')
    } else {
      throw new Error('Invalid Credentials')
    }
  } catch (e) {
    res.status(400).send('Something went wrong: ' + e.message)
  }
})
authRouter.post('/logout', async (req, res) => {
  res
    .cookie('token', null, {
      expires: new Date(Date.now()),
    })
    .send('Logout Succussful!!!') // same as res.send('Logout Succussful!!!')
})

module.exports = authRouter
