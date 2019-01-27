module.exports = (app) => {
app.get('/auth', passport.authenticate('github'));
app.get('/auth/error', auth.error);
app.get('/auth/callback',
  passport.authenticate('github', {failureRedirect: '/auth/error'}),
  auth.callback
);
  
}
