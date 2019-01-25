const mongoose = require('mongoose')
var Schema = mongoose.Schema

const solicitation = Schema({
  suitor: { type: Schema.ObjectId, required: true, ref: 'users'},
  suitorUsername: { type: String, required: true, ref: 'users' },
  suitorFirsName: { type: String, ref: 'users' },
  suitorLastName: { type: String, ref: 'users' },
  suitorAddressState: { type: String, ref: 'users' },
  toRecipient: { type: String, required: true, ref: 'users' },
  text: { type: String },
  allow: { type: Boolean, default: false },
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'solicitations' })

module.exports = mongoose.model('Solicitation', solicitation)