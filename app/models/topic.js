const mongoose = require('mongoose')
const {Schema, model} = mongoose

const topicSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  avatar: {type: String, required: false},
  introduction: {type: String, required: false, select: false}
}, {timestamps: true})

module.exports = model('Topic', topicSchema)