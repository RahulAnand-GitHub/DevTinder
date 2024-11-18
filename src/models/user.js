const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min:18,
    },
    gender: {
      type: String,
      validate(value){
        if(!['M', 'F', 'Others'].includes(value)){
          throw new Error('Gender data is not valid!');
          
        }
      }
    },
    photoUrl: {
      type: String,
      defalut:
        'https://www.msrcasc.edu.in/uploads/media-upload/2023-03/hod-dummy.jpg',
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

const User = mongoose.model('User', userSchema)
module.exports = User
