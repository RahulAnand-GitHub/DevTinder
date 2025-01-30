const express = require('express')
const userRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

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

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 2 ? 2  : limit
    const skip = (page - 1) * limit
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(['fromUserId', 'toUserId'])

    const hiddednUserFromFeed = new Set()
    connectionRequests.forEach((req) => {
      hiddednUserFromFeed.add(req.fromUserId.toString())
      hiddednUserFromFeed.add(req.toUserId.toString())
    })
    // console.log(hiddednUserFromFeed)

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddednUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(['firstName', 'lastName', 'age', 'skills', 'about'])
      .skip(skip)
      .limit(limit)
    res.send(user)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})
module.exports = userRouter
