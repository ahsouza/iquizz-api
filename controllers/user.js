const 
 User = require('../models/user.js'),
 Message = require('../models/message.js'),
 Solicitation = require('../models/solicitation.js'),
 Friend = require('../models/friend.js'),
 Group = require('../models/group.js'),
 Member = require('../models/member.js'),
 Discipline = require('../models/discipline.js'),
 Information = require('../models/information.js'),
 Ask = require('../models/ask.js'),
 School = require('../models/school.js'),
 fs = require('fs'),
 url = require('url'),
 path = require('path'),
 rp = require('request-promise'),
 cheerio = require('cheerio'),
 pusherUser = require('../config/pusher.js'),
 Pusher = require('pusher')
  
var pusher = new Pusher({
  appId: pusherUser.appId,
  key: pusherUser.key,
  secret: pusherUser.secret,
  cluster: pusherUser.cluster,
  encrypted: pusherUser.encrypted
})

exports.quiz = async(req, res) => {
let asksInformatica
  Ask.find()
  .then(asks => {
    asksInformatica = asks
    res.render('user/quiz', { account: {asks: asksInformatica} })
  }).catch(err =>{
    res.send(err)
  })

}

exports.viewAskNew = async(req,res) => {

let disciplinas;
  Discipline.find().sort( [['nameDiscipline', 'ascending'], ['levelLearning', 'ascending']] )
  .then(disciplines => {
    disciplinas = disciplines;
    res.render('user/askNew', { account: {disciplines: disciplinas} }) 
  }).catch(err =>{

  });

}

exports.newAsk = async(req, res) => {

  const ask = new Ask({
    creatorAsk: req.body.creatorAsk,
    discipline: req.body.nameDiscipline,
    content: req.body.content,
    answers: {
      one: { 
        content: req.body.contentAnswer1,
        correct: req.body.correctAnswer1
      },

      two: { 
        content: req.body.contentAnswer2,
        correct: req.body.correctAnswer2
      },

      tree: { 
        content: req.body.contentAnswer3,
        correct: req.body.correctAnswer3
      },

      four: { 
        content: req.body.contentAnswer4,
        correct: req.body.correctAnswer4
      },
    }
  })

  ask.save()
  .then( data => {
    res.redirect('/api/asks/new')
  }).catch(err => {
    res.send(err)
  })
}

exports.registerMemberChat = async(req, res) => {
  if  ((req.body.username != "") && (req.body.password != "")) {
    let query = {username: req.body.username, password: req.body.password}
    // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
    User.findOne(query)
      .then(user => {
        if(req.body.username && req.body.status){
        var newMember = {
          username: req.body.username,
          password: req.body.password,
          status: req.body.status
        }
        req.session.user = newMember
        res.json({  
          success: true,
          error: false
        })
        } else {
          res.json({  
            success: false,
            error: true,
            message: 'Incomplete information: username and status are required'
          })
        }
      }).catch(err => {
          return res.status(500).send({
            message: "Error retrieving user with id> " + req.params.userId
          }).redirect('/')
      })
  }
}

exports.newUser = async(req, res) => {
    // Validate request
  if(!req.body.username) {
    return res.status(400).send({
      message: "Preencha os dados do usuario corretamente"
    })
  }
  // Create a User
  const user = new User({
    firstName:   req.body.firstName,
    lastName:     req.body.lastName,
    username:     req.body.username,
    email:           req.body.email,
    status:           req.body.status,
    password:     req.body.password,
    genre:     req.body.genre,
    academy:     req.body.academy,
    credits:    50,
    tags:     [req.body.firstName, req.body.lastName, req.body.username, req.body.email, req.body.uf, req.body.cidade ],
    location: {
      addressState: req.body.uf,
      addressCity: req.body.cidade,
      addressDistrict: req.body.bairro,
      streetAddress: req.body.logradouro,
      numberAddress: req.body.numero,
      postalCode: req.body.cep,
    }
  })
  // Save User in the database
  user.save()
  .then(data => {
    res.redirect('/')
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    })
    res.render("/", {'errors': [{'msg': error.err}]})
  })
}

exports.loggedIn = async(req, res) => {
  if(req.session.user){
    res.send({ 
      authenticated: true 
    })
  } else {
    res.send({ authenticated: false })
  }
}
exports.allowSolicitation = async(req, res, next) => {
  // Validate Request
  if (req.body.allow) { 
  // Find user and update it with the request body
  Solicitation.findOneAndUpdate({suitorUsername: req.body.allow, toRecipient: req.session.user.username}, {
    allow: true
  }, {new: true})
    .then(solicitation => {
      if(!solicitation) {
        return res.status(404).send({
          message: "solicitation not found with "
        })
      }
  // New friends
   const friend = new Friend({
    from:   req.body.allow,
    to:   req.session.user.username
  })
  // Save User in the database
  friend.save()
  .then(data => {
  })
    User.findOneAndUpdate({ username: req.session.user.username}, {
        friends: { username: req.body.allow}
      }, {new: true})
       .then(solicitation => {
        if(!solicitation) {
          return res.status(404).redirect('/api/error', {
            message: "solicitation not found with "
          })
        }
        }).catch(err => {  
            return res.status(500).redirect('/api/error', {
                message: "Error updating solicitation with id " 
            })
        })
        setInterval(function(){ res.redirect('/api/dashboard')}, 3000)
    }).catch(err => {
        return res.status(500).redirect('/api/error', {
            message: "Error updating solicitation with id " 
        })
    })
  } 
  next()
}
exports.disallowSolicitation = async(req, res) => {
  // Validate Request
  if (req.body.disallow) { 
  // Find user and update it with the request body
  Solicitation.remove({suitorUsername: req.body.disallow, toRecipient: req.session.user.username})
   .then(solicitation => {
      setInterval(function(){ res.redirect('/api/dashboard'); }, 3000)
    })
  }
}
exports.viewDashboard = async(req, res) => {
  let url;
  const options = {
    // uri: `https://www.ifes.edu.br/noticias`,
    uri: `http://www.ufes.br/noticias`,
    transform: (body) => {
      return cheerio.load(body)
    }
  } 
  let news=[]
  let noticias= []
  rp(options)
    .then(($) => {
    $('.views-row').each(function(i, elem) {
      news[i] = $(this).text().trim().replace(/\t|\n/g, "")
      const information = new Information({
        content: news[i],
        tags: ['UFES', req.session.user.location.addressState ]
      })
      information.save()
        .then(informations => {
          }).catch(err => {
            res.status(500)
          })
    })
  })
    .catch((err) => {
      console.log(err)
    })

let users;
  User.find().sort( [['username', 'ascending']] )
   .then(usersOf => {
      users = usersOf
    }).catch(err => {
      res.status(500)
  })

let informationsUfes
  Information.find({tags: 'UFES'}).sort( [['datePublished', 'desc']] )
   .then(informationsOfUfes => {
      informationsUfes = informationsOfUfes
    }).catch(err => {
      res.status(500)
  })

let informationsIfes
  Information.find({tags: 'IFES'})
   .then(informationsOfIfes => {
      informationsIfes = informationsOfIfes
    }).catch(err => {
      res.status(500)
  })

let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations})
  // let query = {creator: req.session.user._id }
let query = {toRecipient: req.session.user.username }
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  Message.find(query).sort( [['data', 'descending']] ).limit(30)
    .then(messages => {
      res.render('user/dashboard', { 
        account: { 
          login: req.session.user.username, 
          firstName: req.session.user.firstName, 
          lastName: req.session.user.lastName ,
          session: req.session.user,
          messages: messages,
          solicitations: solicitation,
          friends: solicitation,
          users: users,
          newsUfes: informationsUfes,
          newsIfes: informationsIfes,
          url: options.uri
      }
    })
    })
    .catch(err => {
      return res.status(500).redirect('/api/error', {
        message: "Error retrieving user"
      })
    })
}

exports.viewRegister = async(req, res) => {
  School.find()
    .then( schools => {
      console.log('Academicos: ' + schools)
      res.render('user/register', { account: { academics: schools, session: req.session.user }})
    }).catch(err =>{
      res.status(500)
    })
}

exports.viewUserProfile = async(req, res) => {
  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
  if (req.params.id != 'header.css') {
     idUser = req.params.id
  }
  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
let solicitations
  Solicitation.find()
   .then(solicitationOf => {
      solicitations = solicitationOf
    }).catch(err => {
      res.status(500)
  })
let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations})
  // let query = {creator: req.session.user._id };
  let query = {toRecipient: req.session.user.username }
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  let messagesMe
  Message.find(query).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages
    })
    .catch(err => {
      res.status(500)
    })
let friends
  Friend.find().sort( [['username', 'ascending']] )
   .then(friendsOf => {
      friends = friendsOf
    }).catch(err => {
      res.status(500)
  })
let groups
  Group.find().sort( [['nickname', 'ascending']] )
   .then(groupsOf => {
      groups = groupsOf
    }).catch(err => {
      res.status(500)
  })
// Display an alert notification
  User.findOne({_id: idUser})
   .then(user => {
      res.render('user/userProfile', { 
        account: { 
          session: req.session.user,
          groups: groups,
          friends: friends,
          solicitations: solicitation,
          messages: messagesMe,
          user: user

        }
      })
    }).catch(err => {
      res.status(500)
  })
}
// exports.viewGroupsSearch = async(req, res, next) => {
// var searchParams = req.query.query.toUpperCase().split(' ');

//   Group.find({ tags: { $all: searchParams }}, function (e, data) {
//     res.render('user/group', { results: true, search: req.query.query, list: data }, { account: { 
//       session: req.session.user,
//       groups: groups,
//       members: members
//     }});
//   });
// }
exports.auth = async(req, res) => {
  if  ((req.session.user.username != "undefined") && (req.session.user.password != "undefined")) {
let  statusUser = req.session.user.status
let query = {username: req.session.user.username, password: req.session.user.password}
    // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
    User.findOne(query)
      .then(user => {
        req.session.user = user
        req.session.user.memberOf.group = req.body.group
        var socketId = req.body.socket_id
        var channel = req.body.channel_name
        var currentMember = req.session.user
        var presenceData = {
          user_id: currentMember.username,
          user_info: {
            status: statusUser,
          }
        }
        var auth = pusher.authenticate(socketId, channel, presenceData)
        res.send(auth)
      }).catch(err => {
        res.redirect('/api/new')
     })
  } 
}

exports.viewEdit = async(req, res) => {
  res.render('user/alter', {
    account: {
      session: req.session.user
    }});
}

// Retrieve and return all users from the database.
exports.findAll = async(req, res) => {
  User.find()
   .then(users => {
      res.send(users);
    }).catch(err => {
      res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  });
};
// Find a single user with a userId
exports.findOne = async(req, res) => {
  User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Usuário não encontrado com id>  " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Usuário não encontrado com id> " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id> " + req.params.userId
        });
   });

};
// Update a user identified by the userId in the request
exports.editUser = async(req, res) => {
  // Validate Request
  // Find user and update it with the request body
  User.findOneAndUpdate({ username: req.session.user.username}, {
    firstName: req.body.firstName,
    lastName:  req.body.lastName,
    username:  req.body.username,
    email:     req.body.email,
    status:    req.body.status,
    location: {
      addressState: req.body.uf,
      addressCity: req.body.cidade,
      addressDistrict: req.body.bairro,
      streetAddress: req.body.logradouro,
      numberAddress: req.body.numero,
      postalCode: req.body.cep
    }
  }, {new: true})
   .then(user => {
    if(!user) {
      return res.status(404)
    }
      setInterval(function(){ res.redirect('/api/dashboard'); }, 2000);
    }).catch(err => {
      return res.status(500)
    })
}
// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
   .then(user => {
    if(!user) {
      return res.status(404).send({
        message: "User not found with id " + req.params.userId
      })
    }
    res.send({message: "User deleted successfully!"})
    }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId
        })
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId
      })
    })
}

exports.logout = async(req,res) => {
  if(req.session.user){
    req.session.user = null
    req.session.destroy()
  }
  res.redirect('/')
}

function sleep (ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}