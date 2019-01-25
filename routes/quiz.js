module.exports = (app) => {
const quizController = require('../controllers/quiz.js')

  app.get('/api/quiz', quizController.quiz)
  app.get('/api/asks/new', quizController.newAsk)
  app.post('/api/asks/new', quizController.saveAsk)
}