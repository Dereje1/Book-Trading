"use strict"//uses twitter to authenticate via passport see also /Authentication_Config/ folder
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//authentication additional requirements
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash    = require('connect-flash');

//var app = require('./app');
// configuration  for authentication===============================================================



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