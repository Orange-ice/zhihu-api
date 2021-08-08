const mongoose = require('mongoose')
const {Schema, model} = mongoose

const commentSchema = new Schema({
  __v: {type: Number, select: false},
  content: {type: String, required: false},
  commentator: {type: Schema.Types.ObjectId, ref: 'User'},
  questionId: {type: String, required: true},
  answerId: {type: String, required: true},
  rootCommentId: {type: String},
  replayTo: {type: Schema.Types.ObjectId, ref: 'User'} // 回复的用户
}, {timestamps: true})

module.exports = model('Comment', commentSchema)