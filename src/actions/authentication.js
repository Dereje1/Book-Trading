"use strict" //only getuser action dispatches to store
import axios from 'axios';

export function getUser(){
  // action gets user authentication status from /profile that is generated
  //and updates store
  return function (dispatch){
    axios.get('/auth/profile')
      .then(function(response){
          dispatch(
              {
                type:"GET_USER_STATUS",
                payload:response.data
              }
            )
        })
      .catch(function(err){
        dispatch({type:"GET_USER_STATUS_REJECTED",payload:err})
      })
    }
}

export function newUser(signupinfo){//routes to new user sign up and sends
  //back server response
  return new Promise(function(resolve,reject){
    axios.post('/auth/signup',signupinfo)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(err){
        reject(err)
      })
  })
}

export function checkUser(logininfo){//routes to login and sends
  //back server response
  return new Promise(function(resolve,reject){
    axios.post('/auth/login',logininfo)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(err){
        reject(err)
      })
  })
}

export function newPass(signupinfo){//routes to password change and sends 
  //back server response
  return new Promise(function(resolve,reject){
    axios.post('/auth/passchange',signupinfo)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(err){
        reject(err)
      })
  })
}
