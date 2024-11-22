const validator = require('validator')

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || ! lastName) {
    throw new Error('Enter a valid name!')
  } else if(!validator.isEmail(email)){
    throw new Error('Email is not valid!')
  } else if(!validator.isStrongPassword(password)){
    throw new Error('Please Enter a strong password!')
  }
}

module.exports = {
    validateSignUpData
}
