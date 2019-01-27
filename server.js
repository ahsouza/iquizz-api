var app = require('./config/express')()

require('./config/database.js')(config.db)

module.exports = app
app.listen(process.env.PORT || 5000, () =>{
  console.log('IQuizz API listening on port 5000!')
})