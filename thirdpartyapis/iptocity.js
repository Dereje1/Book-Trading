"use strict"//converts ip data to city and sends back as promise
var axios = require('axios')

module.exports = function(ip){
  return new Promise(function(resolve,reject){
    axios.get("https://freegeoip.net/json/"+ip)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(error){
        reject(error.response.data)
      })
  })
}
