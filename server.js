const 
 express = require('express'),
 mongoose = require('mongoose'),
 path = require('path'),
 https = require('https'),
 helmet = require('helmet'),
 flash = require('express-flash-messages'),
 bodyParser = require('body-parser'),
 expressSession = require('express-session'),
 csrf = require('csurf'),
 csrfProtection = csrf({cookie: true }),
 cookieParser = require('cookie-parser'),
 load = require('express-load'),
 validator = require('express-validator'),
 url = require('url'),
 rp = require('request-promise'),
 cheerio = require('cheerio'),
 axios = require('axios'),
 favicon = require('static-favicon'),
 uniqid = require('uniqid'),
 morgan = require('morgan'),
 methodOverride = require('method-override'),
 morganToolkit = require('morgan-toolkit')(morgan)
let 
 multer = require('multer'),
 fs = require('fs')
const fileStore = require('session-file-store')(expressSession),
// ==== CONFIG ====
 db = require('./config/database.js'),
 opHelmet = require('./config/helmet.js'),
 User = require('./models/user.js'),
 session = require('./config/session.js')

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;
mongoose.connect(db.url, {useNewUrlParser: true})
  .then(() => {
    console.log('Conectado ao banco de dados MongoDB com sucesso!')
  }).catch(err => {
    console.log('Não pôde se conectar ao banco de dados. Saindo agora...', err)
    process.exit()
  })
Promise = require('promise')
var app = express()
app.use(cookieParser())
app.use(expressSession({
  genid: (req) => {
    return uniqid()
  },
  store: new fileStore(),
  secret:'M3u $3cR3T0 @k1 ',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 6000000 }
}))
app.use((req, res, next) => {
  res.locals.session = req.session;
  next()
})
// app.use(morgan(':username :remote-addr [:date[web]] ":method :url :referrer :status '))
// app.use(morganToolkit())
app.use(flash())
app.use(helmet.noCache())
app.use(helmet.noSniff())
app.use(helmet.ieNoOpen())
app.use(helmet.frameguard({ action: 'deny', domain: `https://localhost:${process.env.PORT}` }))
app.use(helmet.xssFilter({ setOnOldIE: true }))
app.use(helmet.hsts(opHelmet))
app.use(helmet.hidePoweredBy({
  setTo: 'PHP 7.4.2'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(__dirname + '/public/assets/favicon.ico'))
app.set('trust proxy', 1)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

require('./routes/user.js')(app)
require('./routes/message.js')(app)
require('./routes/group.js')(app)
require('./routes/conquest.js')(app)
module.exports = app
app.listen(process.env.PORT || 5000, () =>{
  console.log('IQuizz API listening on port 5000!')
})