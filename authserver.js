"use strict"//
var passport = require('passport');
var flash    = require('connect-flash');

const configEntry = (app) => {
  require('./Authentication_Config/passport-local')(passport); // pass passport for configuration
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash());
  // routes ======================================================================
  require('./Authentication_Config/routes-local.js')(app, passport); // load our routes and pass in our app and fully configured passport
  //end authentication
}

module.exports = configEntry;