const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()
const port = 3000
app.use(express.json())
app.post('/signup', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send('User added successfully.')
  } catch (err) {
    res.send(`Error saving the user: ${err}`)
  }

  //Reading the request
  console.log(req.body)
})

connectDB()
  .then(() => {
    console.log('Database connection is successful.')
    app.listen(port, () => [
      console.log('Server is successfully listening port 3000.'),
    ])
  })
  .catch((err) => {
    console.log(`Error in connection: ${err}.`)
  })
