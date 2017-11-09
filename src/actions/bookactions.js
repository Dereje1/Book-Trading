"use strict"
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
