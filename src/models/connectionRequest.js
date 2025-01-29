// 1. import mongoose
const mongoose = require('mongoose')

// 2. Design a schema / database design
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      requrired: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      requrired: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  { timestamps: true }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre('save', function (next) {
  const connectionRequest = this
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('Cannot send connection request to yourself!!!')
  }
  next()
})

// 4. creating a model

const connectionRequestModel = new mongoose.model(
  'connectionRequest',
  connectionRequestSchema
)

// 5. export statement

module.exports = connectionRequestModel
