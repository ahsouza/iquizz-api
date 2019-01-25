const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const ask = Schema({
  creatorAsk : { type: String, required: true },
  content: { type: String, required: true, index: {unique: true}},
  discipline : { type: String, required: true, ref: 'disciplines'},
  tags: [String],
  answers: { 
    one:{
      content: { type: String, required: true},
      correct: { type: Boolean, default: false },
      points:  { type: Number, default: 0 } 
    },
    two:{
      content: { type: String, required: true},
      correct: { type: Boolean, default: false },
      points:  { type: Number, default: 0 } 
    },
    tree:{
      content: { type: String, required: true},
      correct: { type: Boolean, default: false },
      points:  { type: Number, default: 0 } 
    },
    four:{
      content: { type: String, required: true},
      correct: { type: Boolean, default: false },
      points:  { type: Number, default: 0 } 
    },
  },
  datePublished: { type: Date, default: Date.now }
}, { timestamps: true }, { collection: 'asks' })
module.exports = mongoose.model('Ask', ask)