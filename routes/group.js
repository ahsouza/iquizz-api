module.exports = (app) => {
  const groupController = require('../controllers/group.js')
  
  app.get('/api/groups', groupController.groupAll)
  app.post('/api/groups/:id', groupController.enterGroup)
  app.get('/api/groupMe/:id', groupController.groupMe)
  app.delete('/api/groupMe/:id', groupController.deleteGroup)
  app.get('/api/group/new', groupController.groupNew)
  app.post('/api/group/new', groupController.saveGroup)
}