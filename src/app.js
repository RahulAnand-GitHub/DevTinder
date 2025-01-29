const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

const authRouter = require('./routers/authRouter')
const profileRouter = require('./routers/profile')
const requestsRouter = require('./routers/reqeusts')
const userRouter = require('./routers/user')

app.use(express.json())
app.use(cookieParser())
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestsRouter)
app.use('/', userRouter)
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
