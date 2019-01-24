const 
 User = require('../models/user.js'),
 Friend = require('../models/friend.js'),
 Group = require('../models/group.js'),
 Member = require('../models/member.js')
 Solicitation = require('../models/solicitation.js')
 Message = require('../models/message.js')

exports.groupAll = async(req, res) => {
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
    })
let members;
  Member.find().sort( [['username', 'ascending']] )
   .then(membersOf => {
      members = membersOf;
    }).catch(err => {
      res.status(500)
  })
  Group.find().sort( [['name', 'ascending']] )
   .then(groups => {
      res.render('group/groupAll', { 
        account: { 
          session: req.session.user,
          groups: groups,
          members: members,
          messages: messagesMe,
          solicitations: solicitation
        }
      })
    }).catch(err => {
      res.redirect('/api/dashboard')
    })
}
exports.groupNew = async(req, res) => {
  res.render('group/groupNew')
}

exports.saveGroup = async(req,res) => {
     if(!req.body.nickname) {
    return res.status(400).send({
      message: "Preencha os dados do grupo corretamente"
    })
  }
  const member = new Member({
    username: req.session.user.username,
    nickname: req.body.nickname
  })
  member.save()
  .then(members => {
  }).catch(err => {
    res.render("/", {'errors': [{'msg': error.err}]});
  })
    // Validate request
  if(!req.body.name) {
    return res.status(400).send({
      message: "Preencha os dados do grupo corretamente"
    })
  }
  // Create a Group
  const group = new Group({
    name:   req.body.name,
    nickname:   req.body.nickname,
    key:     req.body.key,
    site:     req.body.site,
    admin:     req.session.user.username,
    members:     req.session.user.username,
    tags: [req.body.nickname, req.session.user.username, req.body.name]
  })
  // Save Group in the database
  group.save()
  .then(data => {
    res.redirect('/api/groupAll')
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    });
    res.render("/", {'errors': [{'msg': error.err}]});
  })
} 

let idGroup;
exports.groupMe = async(req, res) => {
  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
  if (req.params.id != 'header.css') {
     idGroup = req.params.id;
  }
  // TODO: GAMBIARRA> Retornando 'header.css' como params._id
let members;
  Member.find().sort( [['username', 'ascending']] )
   .then(membersOf => {
      members = membersOf;
    }).catch(err => {
      res.status(500)
  })
let solicitation = 
  Solicitation.find({ toRecipient: req.session.user.username }).then(solicitations =>{ solicitation = solicitations;})
  // let query = {creator: req.session.user._id };
let query = {toRecipient: req.session.user.username }
  // user.findById(req.params.userId).select('password username firstNam').exec(function(error, user){
let messagesMe;
  Message.find(query).sort( [['data', 'descending']] )
    .then(messages => {
      messagesMe = messages;
    })
    .catch(err => {
      res.status(500)
    })
let friends;
  Friend.find().sort( [['username', 'ascending']] )
   .then(friendsOf => {
      friends = friendsOf;
    }).catch(err => {
      res.status(500)
  })
// Display an alert notification
  Group.findOne({_id: idGroup})
   .then(group => {
      res.render('group/groupMe', { 
        account: { 
          session: req.session.user,
          group: group,
          messages: messagesMe,
          solicitations: solicitation,
          members: members,
          friends: friends
        }
      })
    }).catch(err => {
      res.status(500)
    })
}

exports.enterGroup = async(req, res) => {
  const member = new Member({
    username: req.session.user.username,
    nickname: req.body.nickname,
  })
  member.save()
  .then(members => {
    setInterval(function(){ res.redirect('/api/groupAll'); }, 3000)
  }).catch(err => {
    res.send(err);
  })
}
exports.deleteGroup = async (req, res) => {
let groupRemove = req.params._id;
  Group.findByIdAndRemove(groupRemove)
   .then(group => {
    if(!group) {
      return res.status(404).send()
    }
    res.redirect('/api/groups')

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