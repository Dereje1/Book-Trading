"use strict"//primary module to interact with client
const router = require('express').Router();
var profiles = require('./models/profile')// schema for user profiles
var books = require('./models/books')//schema for books

router.put('/api/updateprofile/:_id', function(req, res){//update profile from db, note ids are the same as user authentication ids
  if(!req.session.authenticated){
    res.json({"error":"Not Authenticated!!"})
    return
  }
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

router.get('/api/updateprofile/:_id', function(req, res){//gets profile information by id used for profile page place holders
   var query = {_id: req.params._id};
   profiles.find(query,function(err,profile){
     if(err){
       res.json (err) ;
     }
     res.json(profile)
   })
})

router.post('/api/newbook',function(req,res){//adds a new book to the db
  if(!req.session.authenticated){
    res.json({"error":"Not Authenticated!!"})
    return
  }
  var addedBook = req.body;
  books.create(addedBook,function(err,book){
    if(err){
      throw err;
    }
    res.json(book)
  })
})

router.get('/api/:user',function(req,res){//gets books depending on request type per user or all books
  let userName = req.params.user
  let query = (userName==="All") ? {} : {owner: userName};
  books.find(query,function(err,book){
    if(err){
      res.json (err) ;
    }
    res.json(book)
  })
})

router.delete('/api/:_id', function(req,res){//deletes a book by id
  if(!req.session.authenticated){
    res.json({"error":"Not Authenticated!!"})
    return
  }
  var query = {_id: req.params._id};
  books.remove(query, function(err, book){
    if(err){
    throw err;
    }
    res.json(book);
  })
})

router.put('/api/:_id', function(req, res){//for requesting a trade or performing a books swap
  if(!req.session.authenticated){
    res.json({"error":"Not Authenticated!!"})
    return
  }
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


module.exports = router;