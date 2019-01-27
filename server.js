var app = require('./config/express')()

require('./config/database.js')(config.db)
  // load('../controllers')
//     .then('../routes')
//     .then('../models')
//     .into(app);
 require('./routes/user.js')(app)
 require('./routes/message.js')(app)
 require('./routes/group.js')(app)
 require('./routes/conquest.js')(app)
 require('./routes/quiz.js')(app)

module.exports = app
app.listen(process.env.PORT || 5000, () =>{
  console.log('IQuizz API listening on port 5000!')
})