const mongoose = require('mongoose')
const Schema = mongoose.Schema

const member = mongoose.Schema({  
  username: { type: String, required: true, ref: 'users'},
  nickname: { type: String, required: true, ref: 'groups'},
  key: { type: String,  ref: 'groups'},
  admin: { type: String, ref: 'users'},
  members: [{ type: String, ref: 'members'}],
  points: { type: Number, default: 0, minimum: 0, maximum: 1000 },
  img: { data: Buffer, contentType: String },
  stars: { type: Number, default: 0, minimum: 0, maximum: 5 },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }

}, {timestamps: true}, {collection: 'members'})

module.exports = mongoose.model('Member', member)