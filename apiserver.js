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
//not using session in this project but good to have incase
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

var profiles = require('./models/profile')// schema for user profiles
var books = require('./models/books')//schema for books


app.put('/updateprofile/:_id', function(req, res){//update profile from db, note ids are the same as user authentication ids
   var profileToUpdate = req.body;
   var profileID = req.params._id;
   var query = {_id: profileID};

   profiles.find(query,function(err,profile){//first search if id already has a profile attached to it
     if(err){
       res.json (err) ;
     }
     if(!profile.length){//if no profile attached then create and attach one
       let newProfile={
         _id: profileID,
         fullName:profileToUpdate.fullName,
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
     else{//if profile already exists then update per request
       var update = { '$set': {fullName:profileToUpdate.fullName,city: profileToUpdate.city, state: profileToUpdate.state}};//note parse on client side to make sure all 3 fields are present
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

app.get('/updateprofile/:_id', function(req, res){//gets profile information by id used for profile page place holders
   var query = {_id: req.params._id};
   profiles.find(query,function(err,profile){
     if(err){
       res.json (err) ;
     }
     res.json(profile)
   })
})

app.post('/newbook',function(req,res){//adds a new book to the db
  var addedBook = req.body;
  books.create(addedBook,function(err,book){
    if(err){
      throw err;
    }
    res.json(book)
  })
})

app.get('/:user',function(req,res){//gets books depending on request type per user or all books
  let userName = req.params.user
  let query = (userName==="All") ? {} : {owner: userName};
  books.find(query,function(err,book){
    if(err){
      res.json (err) ;
    }
    res.json(book)
  })
})

app.delete('/:_id', function(req,res){//deletes a book by id
  var query = {_id: req.params._id};
  books.remove(query, function(err, book){
    if(err){
    throw err;
    }
    res.json(book);
  })
})

app.put('/:_id', function(req, res){//for requesting a trade or performing a books swap
   var infoToUpdate = req.body;
   var bookID = req.params._id;

   //set update type depending on a request or approval/rejection
   //if request/rejection simply modify request field
   //if swapped change owner in addition to requested field

   let update = infoToUpdate.owner ? { '$set': {requested: infoToUpdate.requested, owner:infoToUpdate.owner}} : { '$set': {requested: infoToUpdate.requested}}
   // When true returns the updated document
   var modified = {new: true};
   books.findByIdAndUpdate(bookID, update, modified, function(err, book){
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
