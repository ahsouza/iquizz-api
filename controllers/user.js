const 
 User = require('../models/user.js'),
 sanitize = require('mongo-sanitize'),
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
 Pusher = require('pusher'),
 bcrypt = require('bcryptjs'),
 passport = require('passport'),
 jwt = require('jsonwebtoken'),
 config = require('../config/jwt.js')

var pusher = new Pusher({
  appId: pusherUser.appId,
  key: pusherUser.key,
  secret: pusherUser.secret,
  cluster: pusherUser.cluster,
  encrypted: pusherUser.encrypted
})

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
            message: 'Suas informações não estão completas: username e status é obrigatório!'
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
  if(!req.body.username) {
    return res.status(400).send({
      message: "Preencha os dados do usuario corretamente"
    })
  }
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
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      user.save()
    })
  })

  // Save User in the database
  user.save().exec()
  .then(data => {
    res.redirect('/')
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Algum erro ocorreu durante a criação do usuário"
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
  if (req.body.allow) { 
  Solicitation.findOneAndUpdate({suitorUsername: req.body.allow, toRecipient: req.session.user.username}, {
    allow: true
  }, {new: true}).exec()
    .then(solicitation => {
      if(!solicitation) {
        return res.status(404).send({
          message: "Não foi possível solicitar a pessoa!"
        })
      }
   const friend = new Friend({
    from:   req.body.allow,
    to:   req.session.user.username
  })
  // Save Friend in the database
  friend.save().exec()
  .then(data => {
  })
    User.findOneAndUpdate({ username: req.session.user.username}, {
        friends: { username: req.body.allow}
      }, {new: true})
       .then(solicitation => {
        if(!solicitation) {
          return res.status(404).redirect('/api/error', {
            message: "Não foi possível solicitar a pessoa! "
          })
        }
        }).catch(err => {  
            return res.status(500).redirect('/api/error', {
                message: "Error ao atualizar usuário!" 
            })
        })
        setInterval(function(){ res.redirect('/api/dashboard')}, 3000)
    }).catch(err => {
        return res.status(500).redirect('/api/error', {
            message: "Error ao atualizar usuário! " 
        })
    })
  } 
  next()
}
exports.disallowSolicitation = async(req, res) => {
  // Validate Request
  if (req.body.disallow) { 
  // Find user and update it with the request body
  Solicitation.remove({suitorUsername: req.body.disallow, toRecipient: req.session.user.username}).exec()
   .then(solicitation => {
      setInterval(function(){ res.redirect('/api/dashboard')}, 3000)
    })
  }
}
exports.viewDashboard = async(req, res) => {
  let url
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
      information.save().exec()
        .then(informations => {
          }).catch(err => {
            res.status(500)
          })
    })
  })
    .catch((err) => {
      console.log(err)
    })

let users
  User.find().sort( [['username', 'ascending']] ).exec()
   .then(usersOf => {
      users = usersOf
    }).catch(err => {
      res.status(500)
  })

let informationsUfes
  Information.find({tags: 'UFES'}).sort( [['datePublished', 'desc']] ).exec()
   .then(informationsOfUfes => {
      informationsUfes = informationsOfUfes
    }).catch(err => {
      res.status(500)
  })

let informationsIfes
  Information.find({tags: 'IFES'}).exec()
   .then(informationsOfIfes => {
      informationsIfes = informationsOfIfes
    }).catch(err => {
      res.status(500)
  })

let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).exec().then(solicitations =>{ solicitation = solicitations})
  // let query = {creator: req.session.user._id }
let query = {toRecipient: req.session.user.username }
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  Message.find(query).sort( [['data', 'descending']] ).limit(30).exec()
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
        message: "Error ao enviar menssagem!"
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
  Solicitation.find().exec()
   .then(solicitationOf => {
      solicitations = solicitationOf
    }).catch(err => {
      res.status(500)
  })
let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations})
  // let query = {creator: req.session.user._id }
  let query = {toRecipient: req.session.user.username }
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
  let messagesMe
  Message.find(query).sort( [['data', 'descending']] ).exec()
    .then(messages => {
      messagesMe = messages
    })
    .catch(err => {
      res.status(500)
    })
let friends
  Friend.find().sort( [['username', 'ascending']] ).exec()
   .then(friendsOf => {
      friends = friendsOf
    }).catch(err => {
      res.status(500)
  })
let groups
  Group.find().sort( [['nickname', 'ascending']] ).exec()
   .then(groupsOf => {
      groups = groupsOf
    }).catch(err => {
      res.status(500)
  })
// Display an alert notification
  User.findOne({_id: idUser}).exec()
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
exports.auth = async(req, res) => {
  if  ((req.session.user.username != "undefined") && (req.session.user.password != "undefined")) {
    let statusUser = req.session.user.status
    let query = {username: req.session.user.username, password: req.session.user.password}
    // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
    User.findOne(query)
      .then(user => {
        // const token = jwt.sign(user, {
        //   expiresIn: 604800, // 1 semana
        //   secret: 'Segredo aqui'
        // })
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
    }
  })
}
exports.editUser = async(req, res) => {
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
      setInterval(function(){ res.redirect('/api/dashboard') }, 2000)
    }).catch(err => {
      return res.status(500)
    })
}
// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  var userId = sanitize(req.params.id)
  User.findByIdAndRemove(userId).exec()
   .then(user => {
    if(!user) {
      return res.status(404).send({
        message: "Usuário não encontrado com o ID" + req.params.userId
      })
    }
    res.send({message: "Usuário deletado com sucesso!"})
    }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'Not Found') {
        return res.status(404).send({
          message: "Usuário não encontrado com ID " + req.params.userId
        })
      }
      return res.status(500).send({
        message: "Não foi possível deletar o usuário com ID " + req.params.userId
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