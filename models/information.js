const mongoose = require('mongoose')
var Schema = mongoose.Schema

const information = Schema({
  content: { type: String, index: { unique: true} },
  academy: { type: String, ref: 'academys'},
  tags: [String],
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'informations' })

module.exports = mongoose.model('Information', information)