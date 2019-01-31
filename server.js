var app = require('./config/express')()
require('./config/database.js')()
require('./config/passport-strategy.js')()

module.exports = app
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{ console.log(`IQuizz API listening on port ${PORT}!`)})