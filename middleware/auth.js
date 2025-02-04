const ensureAuthenticated = (req, res, next) => {
  if (res.locals.logged_in.status) {
    return next();
  }
  res.redirect("/auth/login");
};

export default ensureAuthenticated;
