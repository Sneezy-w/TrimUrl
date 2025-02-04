const ensureAuthenticated = (req, res, next) => {
  if (res.locals.logged_in.status) {
    return next();
  }
  res.redirect('/');
};

export default ensureAuthenticated;
