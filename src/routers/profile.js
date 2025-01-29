const express = require('express')
const profile = express.Router()
const { userAuth } = require('../middlewares/auth')
const { validateEditProfile } = require('../utils/validation')

profile.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (e) {
    res.status(400).send('ERROR: ' + e.message)
  }
})

profile.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error('Invalid Edit Request!')
    }

    const user = req.user

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]))
    await user.save()
    res.send("Profile Updated Successfully!")
  } catch (e) {
    res.status(400).send('ERROR: ' + e.message)
  }
})
module.exports = profile
