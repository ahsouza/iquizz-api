
var 
 passport = require('passport'),
 GitHubStrategy = require('passport-github').Strategy,
 mongoose = require('mongoose')
 config = require('./config.js')

module.exports = () => {
  var User = mongoose.model('User')

    passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    User.findOrCreate(
      { "login" : profile.username}, 
      { "nome" : profile.username},  
      (erro, usuario) => {
        if(erro) {
          console.log(erro)
          return done(erro)
        } 
        return done(null, usuario)
      })
    }
  ))

  passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
  })
   
  passport.deserializeUser((id, done) => {
    User.findById(id).exec()
    .then((usuario) => {
      done(null, usuario)
    })
  })
}
