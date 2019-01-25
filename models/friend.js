const mongoose = require('mongoose')
var Schema = mongoose.Schema

const friend = Schema({
  from: { type: String, required: true, ref: 'users'},
  to: { type: String, required: true, ref: 'users'},
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'friends' })

module.exports = mongoose.model('Friend', friend)