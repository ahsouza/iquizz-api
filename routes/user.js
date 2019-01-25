module.exports = (app) => {
  const
   User = require('../models/user.js'),
   userController = require('../controllers/user.js')
  
  app.get('/isLoggedIn', userController.loggedIn)
  app.get('/logout', userController.logout)
  app.get('/api/new', userController.viewRegister)
  // app.get('/api/account/register', userController.viewRegister);
  app.get('/api/account/me/:id')
  app.post('/api/new', userController.newUser)
  app.post('/api/dashboard', userController.allowSolicitation, userController.disallowSolicitation)
  app.get('/api/dashboard', userController.viewDashboard)
  app.get('/api/users/profile/:id', userController.viewUserProfile)
  app.get('/api/edit', userController.viewEdit)
  app.post('/api/edit', userController.editUser)
  // app.get('/api/groups/search', userController.viewGroupsSearch);
  app.post('/api/auth', userController.auth)
  app.post('/register', userController.registerMemberChat)
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
