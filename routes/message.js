module.exports = (app) => {
  const
   Message = require('../models/message.js'),
   User = require('../models/user.js'),
   Solicitation = require('../models/solicitation.js'),
   Friend = require('../models/friend.js'),
   Member = require('../models/member.js'),
   messageController = require('../controllers/message.js')
  app.get('/api/message', messageController.viewMessage)
  app.get('/api/message/:id', messageController.viewMessageTo)
  app.post('/api/message/send', messageController.sendMessage)
  app.get('/api/ranking', messageController.viewRanking)
  app.post('/api/ranking', messageController.sendSolicitation)
  app.get('/api/contacts/me', messageController.viewFriends)
}