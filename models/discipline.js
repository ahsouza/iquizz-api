const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const discipline = Schema({
  nameDiscipline: { type: String, required: true, index: {unique: true}},
  act: { type: String, required: true},
  levelLearning: { type: String, required: true},
  tags: [String],
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'disciplines' });

module.exports = mongoose.model('Discipline', discipline);