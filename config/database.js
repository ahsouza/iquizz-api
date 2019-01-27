var mongoose = require('mongoose')
var config = require('./config.js')
module.exports = () => {

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;
mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true})
  .then(() => {
    console.log('Conectado ao banco de dados MongoDB com sucesso!')
  }).catch(err => {
    console.log('Não pôde se conectar ao banco de dados. Saindo agora...', err)
    process.exit()
  })
}