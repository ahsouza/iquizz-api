const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = mongoose.Schema({  
  username: { type: String, required: true, index: {unique: true}},
  password: { type: String, required: true},
  status: { type: String, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { data: Buffer, contentType: String },
  genre: { type: String },
  telephone: { optionOne: String, optionTwo: String },
  academy: { type: String, ref: 'schools'},
  site: { type: String }, 
  memberOf: { group: String, key: String },
  tags: [String],
  solicitationFriendship: { type: String, dateRequest: { type: Date, default: Date.now }, ref: 'users' },
  solicitationSend: { type: String, dateRequest: { type: Date, default: Date.now } },
  friends: { username: String, dateAllowed: { type: Date, default: Date.now } },
  gems: { type: Number, default: 0, minimum: 0, maximum: 1000000 },
  medals: { type: Number, default: 0, minimum: 0, maximum: 1000 },
  credits: { type: Number, default: 0, minimum: 0, maximum: 10000000 },
  vitality: { type: Number, default: 100, minimum: 0, maximum: 1000}, 
  level: { type: String, default: 'globin'},
  stars: { type: Number, default: 0, minimum: 0, maximum: 5 },
  messageSend: { 
    title: String,
    content: String,
    comment: {
      content: String,
      date: { type: Date, default: Date.now }, 
      like: Number,
      deslike: Number,
      count: Number
    },
    dateSend: { type: Date, default: Date.now },
    messageCount: Number 
  },
  messageReceived: {
    title: { type: String, ref: 'users'},
    content: { type: String, ref: 'users'},
    comment: {
      creator: { type: Schema.ObjectId, ref: 'users'},
      content: { type: String, ref: 'users'},
      date: { type: String, ref: 'users'},
      like: { type: Number, ref: 'users'},
      deslike: { type: Number, ref: 'users'},
      count: { type: Number, ref: 'users'},
    },
    dateReceived: { type: Date, ref: 'users'},
    messageCount: { type: Number, ref: 'users'},
  },
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
  accessMode: { 
    admin: Boolean,
    bronze: Boolean,
    silver: Boolean,
    gold: Boolean,
    platinium: Boolean,
    premium: Boolean,
    visitor: Boolean,
    enterprise: Boolean
  },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }

}, {timestamps: true}, {collection: 'users'})

module.exports = mongoose.model('User', user)
//TODO Implementação de Token para usuários hash: { type: String, required: true },