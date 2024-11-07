const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://rahulanand88096:Mongo~~~72@namastenode.6yfgq.mongodb.net/devTinder'
  )
}

module.exports = connectDB
