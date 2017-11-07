"use strict" //gets yelp token,caches and sends back as promise
var axios = require('axios')
var queryString = require('query-string');
var cache = require('memory-cache');
//module returns the yelp api token
module.exports = function(){
  return new Promise(function(resolve,reject){
    if(cache.get('ytoken')){//if already in cache no need to make a yelp request again
      //console.log("Old Token Retrieval!!")
      resolve(cache.get('ytoken'))
    }
    else{//if not
      var tokenurl="https://api.yelp.com/oauth2/token"
      var pObject=queryString.stringify({//must stringify with query string or will not work
        grant_type:"client_credentials",
        client_id: process.env.YELP_ClIENT_ID,
        client_secret: process.env.YELP_CLIENT_SECRET
      })
      axios.post(tokenurl,pObject)//send request
        .then(function(response){
          console.log("New Token Retrieval!!")
          cache.put('ytoken', response.data,Number(response.data.expires_in));//cache token and send succesful response
          resolve(response.data)
         })
        .catch(function(err){
          //console.log(err.response.status)
          //console.log(err.response.data)
          //console.log(err.response.headers)
          reject(err.response.data)
        })
    }
  })
}
