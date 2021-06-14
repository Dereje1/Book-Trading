"use strict"
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo');

var app = express();
app.use(logger('dev')); // log every request to the console
app.use(session(
  { secret: process.env.SESSION_SECRET,
    store: MongoStore.create({mongoUrl: process.env.MONGOLAB_URI}),//warning in node if this option is not included
    resave: true,
    saveUninitialized: true
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//server primary route
app.use(express.static(path.join(__dirname, 'public')));

var db = require('./models/db')
require('./authserver')(app)//add authentication
app.use(require('./routes'));

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
