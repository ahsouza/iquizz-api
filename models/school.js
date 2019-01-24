const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const school = Schema({
  name: { type: String, required: true , index: { unique: true }},
  email: { type: String, required: true },
  telephone: { type: String },
  avatar: { data: Buffer, contentType: String },
  site: { type: String },
  courses: [ { nameCourses: [String], sciences: [String], levels: [String] } ],
  stars: { type: Number, default: 0, minimum: 0, maximum: 5 },
  location: { 
    addressCountry: { type: String }, 
    addressCity: { type: String },
    addressState: { type: String },
    addressDistrict: { type: String },
    streetAddress: { type: String },
    numberAddress: { type: String },
    postalCode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    elevation: { type: String } 
  },
  tags: [String],
  datePublished: { type: Date, default: Date.now }

}, { timestamps: true }, { collection: 'schools' });

module.exports = mongoose.model('School', school);