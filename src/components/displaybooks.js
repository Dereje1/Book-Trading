"use strict"
import React, { Component } from 'react';
import {Col,Image,Button} from 'react-bootstrap'
import axios from 'axios';

class Bookview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksList:[],
      booksDetail:[]
    }
  }
  componentDidMount() {
    axios.get('/api/'+this.props.user)
    .then((response)=>{
      this.setState({
        booksList:response.data
      },this.getBookDetails)
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps.newBook[0],this.props.newBook[0])
    if(prevProps.newBook[0]!==this.props.newBook[0]){
      let bookListCopy = JSON.parse(JSON.stringify(this.state.booksList))
      bookListCopy = [...bookListCopy,...this.props.newBook]
      this.setState({
        booksList:bookListCopy,
        booksDetail:[]
      },this.getBookDetails)
    }
  }
  getBookDetails(){
    clearTimeout(this.pauseID)
    this.state.booksList.forEach((b,idx)=>{
      //seacrh google by volume
    this.pauseID = setTimeout(()=>{
      let volurl = "https://www.googleapis.com/books/v1/volumes/"+b.volumeid
      axios.get(volurl)
        .then((response)=>{
          let detailObject={
            imgLink : response.data.volumeInfo.imageLinks.thumbnail,
            previewLink: response.data.volumeInfo.previewLink,
            bookTitle : response.data.volumeInfo.title
          }
          let detailCopy = JSON.parse(JSON.stringify(this.state.booksDetail))
          detailCopy =[...detailCopy,detailObject]
          this.setState({
            booksDetail:detailCopy
          })
        })
        .catch((err)=>{
          console.log(err)
        })
    },idx*500)
    })
  }

  booksDisplay(){
    let allDisplay = this.state.booksDetail.map((b,idx)=>{
      return (
        <div key={idx} className="bookframe" xs={6}>
            <a href={b.previewLink} target="_blank">
              <img className="bookimg" src={b.imgLink}/>
            </a>
            <h5 className="booktitle">{b.bookTitle}</h5>
        </div>
      )
    })
    return allDisplay
  }
  render() {

    return (
      <div id="bookshelf">{this.booksDisplay()}</div>
    );
  }

}

export default Bookview;
