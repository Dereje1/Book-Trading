"use strict"
//mongoose shcema on what to store fror venue goers?
var mongoose = require('mongoose');
var profileschema = mongoose.Schema({
   _id:   String,
   fullName:String,
   city:  String,
   state: String
});

//exported = mongoose.model(collectionName,Schema);
module.exports = mongoose.model('profiles',profileschema);
