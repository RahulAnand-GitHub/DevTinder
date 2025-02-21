const mongoose = require('mongoose')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email Address: ' + value)
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Invalid Email Address: ' + value)
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['M', 'F', 'Others'].includes(value)) {
          throw new Error('Gender data is not valid!')
        }
      },
    },
    photoUrl: {
      type: String,
      defalut:
        'https://www.msrcasc.edu.in/uploads/media-upload/2023-03/hod-dummy.jpg',
      validate(value) {
        if (validator.isURL(value)) {
          throw new Error('Invalid Photo URL: ' + value)
        }
      },
    },
    about: {
      type: String,
      default: 'This is the default description about the user!',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = async function () {
  const user = this
  const token = await jwt.sign({ _id: user._id }, 'RAHUL@7250$MERN', {
    expiresIn: '1d',
  })
  return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this
  const passowrdHash = user.password

  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    passowrdHash
  )
  return isValidPassword
}


const User = mongoose.model('User', userSchema)
module.exports = User
