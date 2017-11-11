"use strict"//self explanatory book crud actions non of these are dispatched to the store
import axios from 'axios'

export function addBook(bookInfo){
  return new Promise((resolve,reject)=>{
    axios.post('/api/newbook',bookInfo)
      .then((response)=>{
        resolve(response.data)
      })
      .catch((err)=>{
        reject(err.data)
      })
  })
}

export function getBooks(query){
  return new Promise((resolve,reject)=>{
    axios.get('/api/'+query)
    .then((response)=>{
      resolve(response.data)
    })
    .catch((err)=>{
      reject(err.data)
    })
  })
}

export function deleteBook(query){
  return new Promise((resolve,reject)=>{
    axios.delete('/api/'+query)
    .then((response)=>{
      resolve(response.data)
    })
    .catch((err)=>{
      reject(err.data)
    })
  })
}

export function tradeRequest(query,trader){
  return new Promise((resolve,reject)=>{
    axios.put('/api/'+query,trader)
    .then((response)=>{
      resolve(response.data)
    })
    .catch((err)=>{
      reject(err.data)
    })
  })
}
