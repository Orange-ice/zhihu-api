const mongoose = require('mongoose')
const {Schema, model} = mongoose

const commentSchema = new Schema({
  __v: {type: Number, select: false},
  content: {type: String, required: false},
  commentator: {type: Schema.Types.ObjectId, ref: 'User'},
  questionId: {type: String, required: false},
  answerId: {type: String, required: false}
})

module.exports = model('Comment', commentSchema)