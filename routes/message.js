module.exports = (app) => {
  const
   messageController = require('../controllers/message.js')
  app.get('/api/message', messageController.viewMessage)
  app.get('/api/message/:id', messageController.viewMessageTo)
  app.post('/api/message/send', messageController.sendMessage)
  app.get('/api/ranking', messageController.viewRanking)
  app.post('/api/ranking', messageController.sendSolicitation)
  app.get('/api/contacts/me', messageController.viewFriends)
}