"use strict"
//mongoose shcema on what to store fror venue goers?
var mongoose = require('mongoose');
var bookschema = mongoose.Schema({
   owner:       String,
   volumeid:   String,
   traded:     Boolean,
   requested:  String,
   timestamp:  String,
   imgLink : String,
   previewLink: String,
   bookTitle : String
});

//exported = mongoose.model(collectionName,Schema);
module.exports = mongoose.model('books',bookschema);
