"use strict"//primary module to interact with client
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios')
var queryString = require('query-string');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var app = express();
//need session to store yelp data, not storing than in db, note same session as user authentication should be split out??
app.use(session(
  { secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),//warning in node if this option is not included
    resave: true,
    saveUninitialized: true
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//APIs Start
var db = require('./models/db') //mongoose required common db
//var db = require('./models/db') //mongoose required schema
var profiles = require('./models/profile')
var books = require('./models/books')
//update profile from db
app.put('/updateprofile/:_id', function(req, res){
   var profileToUpdate = req.body;
   var profileID = req.params._id;
   var query = {_id: profileID};

   profiles.find(query,function(err,profile){
     if(err){
       res.json (err) ;
     }
     if(!profile.length){
       let newProfile={
         _id: profileID,
         city:profileToUpdate.city,
         state: profileToUpdate.state
       }
        profiles.create(newProfile,function(err,profile){
         if(err){
           throw err;
         }
         res.json(profile)
       })
     }
     else{
       var update = { '$set': {city: profileToUpdate.city, state: profileToUpdate.state}};
       var modified = {new: true};
       profiles.findByIdAndUpdate(profileID, update, modified, function(err, profile){
           if(err){
             throw err;
           }
           res.json(profile);
       })
     }
   })

})

app.post('/newbook',function(req,res){
  var addedBook = req.body;
  books.create(addedBook,function(err,book){
    if(err){
      throw err;
    }
    res.json(book)
  })
})
app.get('/:user',function(req,res){
  let userName = req.params.user
  let query = (userName==="All") ? {} : {user: userName};
  books.find(query,function(err,book){
    if(err){
      res.json (err) ;
    }
    res.json(book)
  })
})
app.delete('/:_id', function(req,res){
  var query = {_id: req.params._id};
  books.remove(query, function(err, book){
    if(err){
    throw err;
    }
    res.json(book);
  })
})
//APIs end
app.listen(3001,function(err){
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
