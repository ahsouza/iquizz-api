module.exports = (app) => {
  const Message = require('../models/message.js');
  const User = require('../models/user.js');
  const Solicitation = require('../models/solicitation.js');
  const Friend = require('../models/friend.js');
  const Member = require('../models/member.js');
  const messageController = require('../controllers/message.js');
  
  app.get('/api/message', messageController.viewMessage);
 
  app.get('/api/message/:id', messageController.viewMessageTo);

  app.post('/api/message/send', messageController.sendMessage);
  
  app.get('/api/ranking', messageController.viewRanking);

  app.post('/api/ranking', messageController.sendSolicitation);
  
  app.get('/api/contacts/me', messageController.viewFriends);
  
  
  // app.post('/api/message/groups/all', messageController.addContact);


}