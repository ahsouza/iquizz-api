const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const group = mongoose.Schema({  
  name: { type: String, required: true},
  nickname: { type: String, required: true,  index: {unique: true}},
  key: { type: String, required: true},
  admin: { type: String, required: true, ref: 'users'},
  members: [{ type: String, ref: 'users'}],
  points: { type: Number, default: 0, minimum: 0, maximum: 1000 },
  tags: [String],
  img: { data: Buffer, contentType: String },
  stars: { type: Number, default: 0, minimum: 0, maximum: 5 },
  location: { 
    addressCountry: { type: String }, 
    addressCity: { type: String },
    addressState: { type: String },
    addressDistrict: { type: String },
    streetAddress: { type: String },
    numberAddress: { type: String },
    postalCode: { type: String },
    elevation: { type: Number }, 
    latitude: { type: Number },
    longitude: { type: Number }
  },
  site: { type: String },
  social: { 
    behavior: String, 
    facebook: String, 
    github: String, 
    linkedin: String, 
    instagram: String, 
    telegram: String, 
    twitter: String, 
    youtube: String, 
  },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }

}, {timestamps: true}, {collection: 'groups'});  


module.exports = mongoose.model('Group', group);
// hash: { type: String, required: true },