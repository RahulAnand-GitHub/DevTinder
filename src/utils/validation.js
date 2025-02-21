const validator = require('validator')

const validateSignUpData = (req) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName) {
      throw new Error('Enter a valid name!')
    } else if (!validator.isEmail(email)) {
      throw new Error('Email is not valid!')
    } else if (!validator.isStrongPassword(password)) {
      throw new Error('Please Enter a strong password!')
    }
  } catch (e) {
    req.status(400).send('Error: ' + e.message)
  }
}

const validateEditProfile = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'email',
    'photoUrl',
    'about',
    'skills',
    'photoUrl',
    'gender',
    'age'
  ]
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  )
  return isEditAllowed
}

module.exports = {
  validateSignUpData,
  validateEditProfile,
}
