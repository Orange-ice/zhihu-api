const mongoose = require('mongoose')
const {Schema, model} = mongoose
/**
 * @param name 姓名
 * @param password 密码
 * @param avatar 头像的url
 * @param gender 性别
 * @param headline 个人的一句话介绍
 * @param business 行业
 * @param employment 职业经历 (公司，岗位，开始时间，结束时间)
 * @param educations 教育经历 (学校，专业，学历【1 高中及以下，2 大专，3 本科，4 硕士，5 博士及以上】,开始时间，结束时间)
 * @param following 关注的人
 * @param followingTopics 关注的话题
 * @param likingAnswers 赞过的回答
 * @param dislikingAnswers 踩过的回答
 * @param collectingAnswers 收藏的答案
 * */
const UserSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  password: {type: String, required: true, select: false},
  avatar: {type: String},
  gender: {type: String, enum: ['male', 'female']},
  headline: {type: String},
  locations: {type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},
  business: {type: Schema.Types.ObjectId, ref: 'Topic', select: false},
  employment: {
    type: [{
      company: {type: Schema.Types.ObjectId, ref: 'Topic'},
      job: {type: Schema.Types.ObjectId, ref: 'Topic'},
      startDate: {type: String},
      endDate: {type: String}
    }],
    select: false
  },
  educations: {
    type: [{
      school: {type: Schema.Types.ObjectId, ref: 'Topic'},
      major: {type: Schema.Types.ObjectId, ref: 'Topic'},
      diploma: {type: Number, enum: [1, 2, 3, 4, 5]},
      startDate: {type: String},
      endDate: {type: String}
    }],
    select: false
  },
  following: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    select: false
  },
  followingTopics: {
    type: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
    select: false
  },
  likingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },
  dislikingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },
  collectingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  }
})

module.exports = model('User', UserSchema)