const 
 express = require('express'),
 path = require('path'),
 helmet = require('helmet'),
 flash = require('express-flash-messages'),
 connectFlash = require('connect-flash'),
 passport = require('passport'),
 localStrategy = require('passport-local'),
 bodyParser = require('body-parser'),
 expressSession = require('express-session'),
 csrf = require('csurf'),
 csrfProtection = csrf({cookie: true }),
 cookieParser = require('cookie-parser'),
 config  = require('./config.js'),
 cors = require('cors'),
 load = require('express-load'),
 validator = require('express-validator'),
 url = require('url'),
 favicon = require('static-favicon'),
 uniqid = require('uniqid'),
 morgan = require('morgan'),
 morganToolkit = require('morgan-toolkit')(morgan)
let 
 multer = require('multer'),
 fs = require('fs')
const fileStore = require('session-file-store')(expressSession),
// ==== CONFIG ====
 opHelmet = require('./helmet.js'),
 session = require('./session.js')

module.exports = () => {
var app = express()
app.use(require('method-override')())
app.use(cookieParser())
app.use(expressSession({
  genid: (req) => {
    return uniqid()
  },
  store: new fileStore(),
  secret:'This is secret, allright? ',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 6000000 }
}))
// app.use((req, res, next) => { 
//   res.locals.session = req.session 
//   next() 
// })
// app.use(morgan(':username :remote-addr [:date[web]] ":method :url :referrer :status '))
// app.use(morganToolkit())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(cors())
app.use(flash(connectFlash))
app.use(helmet.noCache())
app.use(helmet.noSniff())
app.use(helmet.ieNoOpen())
app.use(helmet.frameguard({ action: 'deny', domain: `https://localhost:${process.env.PORT}` }))
app.use(helmet.xssFilter({ setOnOldIE: true }))
app.use(helmet.hsts(opHelmet))
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 7.4.2'
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))
app.use(favicon(__dirname + '../public/assets/favicon.ico'))
app.set('trust proxy', 1)
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')

 require('../routes/user.js')(app)
 require('../routes/message.js')(app)
 require('../routes/group.js')(app)
 require('../routes/conquest.js')(app)
 require('../routes/quiz.js')(app)
 
  return app
}