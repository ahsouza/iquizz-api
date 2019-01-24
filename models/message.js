const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const message = Schema({
  creator: { type: Schema.ObjectId, required: true, ref: 'users'},
  creatorName: { type: String, required: true, ref: 'users' },
  toRecipient: { type: String, required: true, ref: 'users' },
  text: { type: String, required: true },
  comment: {
    commentCreator: { type: Schema.ObjectId, ref: 'users'},
    commentContent: String,
    commentDate: Date,
    commentLike: { type: Boolean, default: false },
    commentDeslike: { type: Boolean, default: false },
    commentCount: Number
  },
  like: { type: Boolean, default: false },
  deslike: { type: Boolean, default: false },
  count: Number,
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'messages' });

module.exports = mongoose.model('Message', message);