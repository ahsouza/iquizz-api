module.exports = (app) => {
  const Conquest = require('../models/discipline.js'),
  conquestController = require('../controllers/conquest.js')

  app.get('/api/conquests', conquestController.conquestAll)
  app.get('/api/conquest/new', conquestController.conquestNew)
  app.post('/api/conquest/new', conquestController.saveConquest)
  app.get('/api/conquest/me', conquestController.conquestMe)
}
  

  // const isLoggedIn = (req, res, next) => {
  //    if(typeof(req.session.username) != 'undefined'){
  //      if(req.session.username != '' && req.session.login == true) {
  //        res.redirect('/');     
  //      }
  //    }
  //   next();
  // }

  // const isLogged = (req, res, next) => {
  //   if(typeof(req.session.username) == 'undefined' && req.session.login == false){
  //       res.redirect('/login');      
  //   }
  //   next();
  // }

  // const isAdmin = (req, res, next) => {
  //   if(typeof(req.session.isAdmin) == true){
  //       res.redirect('/config');      
  //   }
  //   next();
  // }
