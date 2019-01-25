Conquest = require('../models/discipline.js')
Users = require('../models/user.js')
//TODO Função para listar conquistas por nível do usuário => Conquest.find().where('levelLearning').equals(req.session.user.level).sort( [['nameDiscipline', 'ascending']] )
exports.conquestAll = async(req, res) => {
  await sleep(1000)
  let conquests
    Conquest.find().where('levelLearning').equals(req.session.user.level).sort( [['nameDiscipline', 'ascending']] )
    .then(disciplines => {
      conquests = disciplines
      res.render('conquest/conquestAll', { account: {disciplines: conquests} })
    }).catch(err =>{
      res.status(500)
    })
}
exports.conquestMe = async(req, res) => {
  res.render('conquest/conquestMe')
}
exports.conquestNew = async(req, res) => {
  await sleep(1000)
  res.render('conquest/conquestNew')
}
exports.saveConquest = async(req, res) => {
  if(!req.body.nameDiscipline) {
    return res.status(400).send({
      message: "Preencha os dados da disciplina corretamente"
    })
  }
  await sleep(1000)
  const conquest = new Conquest({
    nameDiscipline: req.body.nameDiscipline,
    act: req.body.act,
    levelLearning: req.body.lvl
  })
  conquest.save()
    .then(conquest => {
      res.redirect('/api/dashboard')
    }).catch(err => {
      res.status(500)
    })
}
function sleep (ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}