const express = require('express')
const requestRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const connectionRequestModel = require('../models/connectionRequest')
const User = require('../models/user')

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      //check the existing connection request.

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection Request Already Exist!!!' })
      }

      //
      const toUser = await User.findById(toUserId)
      if (!toUser) {
        return res.status(400).send({ message: 'User not found!!!' })
      }

      const allowedStatus = ['ignored', 'accepted']
      if (allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid Status type ' + status })
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })

      const request = await connectionRequest.save()
      res.json({
        message: 'Connection Request Sent Successfully.',
        request,
      })
    } catch (e) {
      res.status(400).send(`ERROR: ${e.message}`)
    }
  }
)
requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user
      const { status, requestId } = req.params
      const allowedStatus = ['accepted', 'rejected']
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Status not allowed!!!' })
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      })
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection request not found!!!' })
      }
      connectionRequest.status = status

      const data = await connectionRequest.save()

      res.json({
        message: 'Connection Request ' + status,
        data,
      })
    } catch (e) {
      res.status(400).send(`ERROR: ${e.message}`)
    }
  }
)

module.exports = requestRouter
