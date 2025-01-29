const express = require('express')
const userRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName age gender skills about')

    // }).populate('fromUserId', ['firstName', 'lastName'])
    res.json({
      message: 'Data fetched successfully.',
      data: connectionRequest,
    })
  } catch (e) {
    res.statusCode(400).send('ERROR: ' + e.message)
  }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', [
        'firstName',
        'lastName',
        'age',
        'gender',
        'skill̉',
        'about',
      ])
      .populate('toUserId', [
        'firstName',
        'lastName',
        'age',
        'gender',
        'skill̉',
        'about',
      ])
      console.log(connectionRequest)
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })
    res.send(data)
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
})

module.exports = userRouter
