"use strict"
import axios from 'axios'

export function updateProfile(profileInfo){
  return new Promise((resolve,reject)=>{
    axios.put('/api/updateprofile/'+profileInfo._id,profileInfo)
      .then((response)=>{
        resolve(response.data)
      })
      .catch((err)=>{
        reject(err.data)
      })
  })
}

export function getProfile(id){
  return new Promise((resolve,reject)=>{
    axios.get('/api/updateprofile/'+id)
      .then((response)=>{
        resolve(response.data)
      })
      .catch((err)=>{
        reject(err.data)
      })
  })
}
