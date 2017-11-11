"use strict"//displays books in different formats for authenticated or non-authenticated users
import React, { Component } from 'react';
import {connect} from 'react-redux';//to check if display is for an authenticated user
import {Col,Tooltip,Button,OverlayTrigger} from 'react-bootstrap'
import axios from 'axios';//for pulling google books search client side


import {deleteBook,tradeRequest} from '../actions/bookactions'//server requests to delete and trade books
import Controlpanel from './bookcontrol'//control panel on each book

class Bookview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksList:[]//used for client side book crud updating
    }
  }
  componentDidMount() {
    //if on home page display all books otherwise display only books that the user owns
    let dbpath = (this.props.viewType==="All") ? "All" : this.props.user.user.userName
    //get books from db on mount
    axios.get('/api/'+dbpath)
    .then((response)=>{
      this.setState({
        booksList:response.data
      })
    })
    .catch((err)=>{
      console.log(err)
    })

  }
  componentDidUpdate(prevProps, prevState) {
    //console.log(prevProps.newBook[0],this.props.newBook[0])
    //update state if newbooks have been added or a book swap has been approved
    //useful only for client side rendering
    if(prevProps.newBook[0]!==this.props.newBook[0]){
      let bookListCopy = JSON.parse(JSON.stringify(this.state.booksList))
      bookListCopy = [...bookListCopy,...this.props.newBook]
      this.setState({
        booksList:bookListCopy
      })
    }
    if(prevProps.swap!==this.props.swap){
      let bookListCopy = JSON.parse(JSON.stringify(this.state.booksList))
      let indexOfDeletion = bookListCopy.findIndex((b)=>{
        return (b._id===this.props.swap)
      })
      bookListCopy=[...bookListCopy.slice(0,indexOfDeletion),...bookListCopy.slice(indexOfDeletion+1)]
      this.setState({
        booksList:bookListCopy
      })
    }
  }


  removeBook(dbID){//deletes a book from entire app if owned by user
    let bookListCopy = JSON.parse(JSON.stringify(this.state.booksList))
    let indexOfDeletion = bookListCopy.findIndex((b)=>{
      return b._id===dbID
    })
    bookListCopy =[...bookListCopy.slice(0,indexOfDeletion),...bookListCopy.slice(indexOfDeletion+1)]
    this.setState({
      booksList:bookListCopy
    },()=>deleteBook(dbID))
  }
  tradeBook(book){//puts in a trade request for a book
    if(!this.props.user.user.userID){//can not put in a trade request unless authenticated
      window.location='/login'
      return;
    }
    if(book.requested.length!==0){//if another trade request is pending can not put in a trade request
      this.props.modalCallback(book.bookTitle+" is pending a trade request approval")
      return;
    }
    let tradeInfo ={//user information to send to db
      requested:this.props.user.user.userName
    }
    tradeRequest(book._id,tradeInfo)
    .then((response)=>{//on a succesful trade request redirect to my books to manage requests
      //this.props.modalCallback("New Trade request for " + book.bookTitle)
      window.location='/mybooks'
    })
  }
  booksDisplay(){//main function that displays books
    let allDisplay = this.state.booksList.map((b,idx)=>{
      let booktitle,tooltip,owner,requested
      //if book titles are too long cut them off and add a tool tip
      if(b.bookTitle.length>20){
        tooltip = (<Tooltip id="tooltip"><strong>{b.bookTitle}</strong></Tooltip>);
        booktitle = b.bookTitle.substr(0,20)+"..."
      }
      else{
        tooltip = (<Tooltip id="tooltip"></Tooltip>);
        booktitle = b.bookTitle
      }
      //need owner and requested info to send to Controlpanel
      owner = (b.owner===this.props.user.user.userName) ? true : false
      requested = (b.requested.length) ? true : false
      return (
        <div key={idx} className="bookframe">
            <a href={b.previewLink} target="_blank">
              <img className="bookimg" src={b.imgLink}/>
            </a>
            <Controlpanel
            status={this.props.viewType}
            isOwner={owner}
            isRequested={requested}
            onDelete={()=>this.removeBook(b._id)}
            onTrade={()=>this.tradeBook(b)}
            />
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <h6 className="booktitle">{booktitle}</h6>
            </OverlayTrigger>
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

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(Bookview)
