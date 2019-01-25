const 
 Conquest = require('../models/discipline.js'),
 Information = require('../models/information.js'),
 Ask = require('../models/ask.js'),
 School = require('../models/school.js')

exports.quiz = async(req, res) => {
  let asksInformatica
  Ask.find()
  .then(asks => {
    asksInformatica = asks
    res.render('quiz/quiz', { account: {asks: asksInformatica} })
  }).catch(err =>{
    res.send(err)
  })
}  
exports.newAsk = async(req, res) => {
  let conquests
  Conquest.find().sort( [['nameDiscipline', 'ascending'], ['levelLearning', 'ascending']] )
  .then(disciplines => {
    conquests = disciplines
    res.render('quiz/askNew', { account: {disciplines: conquests} }) 
  }).catch(err =>{
    res.status(500)
  })
}
exports.saveAsk = async(req, res) => {
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