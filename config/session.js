const expressSession = require('express-session'), fileStore = require('session-file-store')(expressSession), uniqid = require('uniqid')

module.exports = {
  genid: (req) => {
    return uniqid() // use UUIDs for session IDs
  },
  store: new fileStore(),
  secret:'M3u $3cR3T0 @k1',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 6000000 }
}