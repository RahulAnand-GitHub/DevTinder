const express = require('express')
const connectDB = require('./config/database')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const validator = require('validator')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
  try {
    // Data validation
    validateSignUpData(req)

    // Encrypt the password
    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    // Creating a new instance of the User m odel
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    await user.save()
    res.send('User added successfully.')
  } catch (err) {
    res.status(400).send(`ERROR: ${err}`)
  }

  //Reading the request
  //console.log(req.body)
})

//login Api
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!validator.isEmail(email)) {
      throw new Error('Not a valid email')
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      throw new Error(`Invalid Credentials`)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (isValidPassword) {
      //create jwt token
      const token = await jwt.sign({ _id: user._id }, 'RAHUL@7250$MERN')

      //Add the token to cookie and send back the response back to the user
      res.cookie('token', token)
      res.send('Login Successful!!!')
    } else {
      throw new Error('Invalid Credentials')
    }
  } catch (e) {
    res.status(400).send('Something went wrong: ' + e.message)
  }
})

app.get('/profile', async (req, res) => {
  try {
    const cookies = req.cookies
    const { token } = cookies
    //error handling
    if (!token) {
      throw new Error('Invalid Token!!!')
    }
    //verifying the token
    const decodedMessage = await jwt.verify(token, 'RAHUL@7250$MERN')

    const { id } = decodedMessage
    const user = await User.findOne(id)
    if (!user) {
      throw new Error('User not found!!! Please SignUp and Login Again.')
    }
    const { firstName, lastName } = user
    res.send(user)
  } catch (e) {
    res.status(400).send('ERROR: ' + e.message)
  }
})

//geting data from the database
app.get('/user', async (req, res) => {
  const userEmail = req.body.email

  try {
    const user = await User.find({ email: userEmail })
    if (user.length === 0) {
      res.status(404).send('User not found.')
    } else {
      res.send(user)
    }
  } catch (e) {
    res.status(400).send('Something went wrong')
  }
})

//deleting data from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId
  try {
    const user = await User.findByIdAndDelete(userId)
    res.send('User deleted successfully.')
  } catch (e) {
    res.status(400).send('Something went wrong.')
  }
})

//updating data in the database
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId
  const data = req.body

  try {
    // API level validation
    const ALLOWED_UPDATES = [
      'photoUrl',
      'gender',
      'age',
      'about',
      'password',
      'skills',
    ]

    const isUpdate_Allowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    )
    if (!isUpdate_Allowed) {
      throw new Error('Update not allowed.')
    }
    if (data?.skills.length > 10) {
      throw new Error('Skills can not be more than 10.')
    }

    // Schema Validation
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after',
      runValidators: true,
    })
    res.send('User updated successfully.')
  } catch (e) {
    res.status(400).send('UPDATE FAILED: ' + e.message)
  }
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
