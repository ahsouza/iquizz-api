const User = require('../models/user.js');
const Message = require('../models/message.js');
const Solicitation = require('../models/solicitation.js');
const Discipline = require('../models/discipline.js')
const Friend = require('../models/friend.js')
const Group = require('../models/group.js')
const Member = require('../models/member.js');
const fs = require('fs');
const url = require('url');
const  path = require('path');

exports.viewMessage = async(req, res) => {

let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations;})
  // let query = {creator: req.session.user._id };
  let query = {toRecipient: req.session.user.username };
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  let messagesMe;
  Message.find(query).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages;
      res.render('user/message', { 
        account: { 
          login: req.session.user.username, 
          firstName: req.session.user.firstName, 
          lastName: req.session.user.lastName,
          session: req.session.user,
          messages: messagesMe,
          solicitations: solicitation
        }
  })
    })
    .catch(err => {
      res.status(500)
    });


  return;
}

exports.viewMessageTo = async(req, res) => {
  let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations;})
  // let query = {creator: req.session.user._id };
  let query = {toRecipient: req.session.user.username };
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  let messagesMe;
  Message.find(query).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages;
    })
    .catch(err => {
      res.status(500)
    });  

  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
  if (req.params.id != 'header.css') {
     idUser = req.params.id;
  }
  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
let friends;
  Friend.find().sort( [['username', 'ascending']] )
   .then(friendsOf => {
      friends = friendsOf;
    }).catch(err => {
      res.status(500)
  });

// Display an alert notification
  User.findOne({_id: idUser})
   .then(user => {
      res.render('user/messageTo', { 
        account: { 
          session: req.session.user,
          friends: friends,
          user: user,
          messages: messagesMe,
          solicitations: solicitation
        }});
    }).catch(err => {
      res.status(500)
  });
 
}

exports.viewRanking = async(req, res) => {

  let friends;
  Friend.find()
   .then(friendsOf => {
      friends = friendsOf;
    }).catch(err => {
      res.status(500)
  });

  let jogadores;
  User.find().limit(12).sort( [['gems', -1]] )
   .then(jogadoresOf => {
    jogadores = jogadoresOf;
   }).catch(err => {
     res.status(500)
   });




  let query = {username: req.session.user.username, password: req.session.user.password};
    // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
    User.findOne(query)
      .then(user => {
        req.session.user = user;
      }).catch(err => {
         return res.status(500).redirect('/api/dashboard');
     });


let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations;})
  // let query = {creator: req.session.user._id };
  let query2 = {toRecipient: req.session.user.username };
  
  let solicitations =
  Solicitation.find()
   .then(solicitationsOf => {
      solicitations = solicitationsOf;
    }).catch(err => {
      res.status(500)
  });
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  let messagesMe;
  Message.find(query2).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages;
    })
    .catch(err => {
      res.status(500)
    });


  User.find()
      .then(contacts => {
        console.log('CONTATOS>: ' + contacts);
        res.render('user/ranking', { 
          account: { 
            login: req.session.user.username, 
            firstName: req.session.user.firstName, 
            lastName: req.session.user.lastName ,
            session: req.session.user,
            contacts: contacts,
            friends: friends,
            jogadores: jogadores,
            solicitations: solicitation,
            solicitationsAll: solicitations,
            messages: messagesMe
        }})
        return;
      })
      .catch(err => {
        return res.status(500).send({
            message: "Contatos não encontrado!"
          });
      });

};

exports.viewFriends = async(req, res) => {
 let queryFriends =  { $or: [ { from: req.session.user.username}, { to: req.session.user.username } ] } ;
 let messagesMe;
  Message.find(queryFriends).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages;
    })
    .catch(err => {
      res.status(500)
    });

 let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations;})
  // let query = {creator: req.session.user._id };
  let query = {toRecipient: req.session.user.username };   

  Friend.find(query)
      .then(friends => {
        console.log('CONTATOS>: ' + friends);
        res.render('user/friend', { 
          account: { 
            login: req.session.user.username, 
            firstName: req.session.user.firstName, 
            lastName: req.session.user.lastName ,
            session: req.session.user,
            friends: friends,
            messages: messagesMe,
            solicitations: solicitation
        }})
        return;
      })
      .catch(err => {
        return res.status(500).send({
            message: "Amigos não encontrado!"
          });
      });

};


exports.viewGroupsAll = async(req, res) => {

  Message.find().sort( [['data', 'descending']] ).limit(30)
    .then(messages => {
      console.log('Menssagens back: ' + messages);
      res.render('user/groupsAll', { 
        account: { 
          login: req.session.user.username, 
          firstName: req.session.user.firstName, 
          lastName: req.session.user.lastName ,
          session: req.session.user,
          messages: messages
      }});
    })
    .catch(err => {
      return res.status(500).send({
          message: "Ainda não nenhuma mensagem foi criada"
        });
    });
}


exports.sendMessage = async(req, res) => {
  // Validate request
  if(!req.body.text) {
    return res.status(400).send({
      message: "Preencha os dados da reclamação corretamente"
    });
  }

  req.body.creator = req.session.user._id;
  req.body.creatorName = req.session.user.username;
  // Create a Message
  const message = new Message({
    creator:   req.body.creator,
    creatorName:   req.body.creatorName,
    text:     req.body.text,
    toRecipient:     req.body.toRecipient,
    // like: req.body.like || 'Untitled like',
    // deslike: req.body.deslike || 'Untitled deslike',
    // comment: {
    //   commentCreator: req.body.creator || 'Untitled commentCreator',
    //   commentContent: req.body.content || 'Untitled commentContent',
    //   commentLike: req.body.commentLike || 'Untitled commentLike',
    //   commentDeslike: req.body.commentDeslike || 'Untitled commentDeslike'
    // }     
  });
  // Message User in the database
  message.save()
  .then(message => {
    res.redirect('/api/dashboard');
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    });
    res.send("/api/error", {'errors': [{'msg': error.err}]});
  });

  return;
};


exports.sendSolicitation = async(req, res) => {
  // Validate request
  // Create news Solicitations
  const solicitation = new Solicitation({
    suitor: req.session.user._id,
    suitorUsername: req.session.user.username,
    toRecipient: req.body.solicitationFriendship
  });
  // Solicitation User in the database
  solicitation.save()
  .then(message => {
    res.redirect('/api/ranking');
  }).catch(err => {
    res.status(500).send(err);
  });

  return;
};
