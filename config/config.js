module.exports = {
 db: process.env.MONGODB_URI || 'mongodb://localhost:27017/iquizz-api',
 github: { clientID: '', clientSecret: '', callbackURL: 'http://localhost:5000/auth/github/callback'},
 google: { clientID: '', clientSecret: '', callbackURL: 'http://localhost:5000/auth/google/callback'}
}