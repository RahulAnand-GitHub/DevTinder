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
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully.')
  }catch(e){
    res.status(400).send('Something went wrong.')
  }
})

//updating data in the database
app.patch('/user', async(req, res)=>{
  const userId = req.body.userId
  const data = req.body
  try{
    const user = await User.findByIdAndUpdate(userId, data,{
      returnDocument:'after',
      runValidators: true,
    })
    console.log(user)
    res.send('User updated successfully.')

  }catch(e){
    res.status(400).send('Something went wrong.')
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
