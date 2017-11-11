"use strict"
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Col,Tooltip,Button,OverlayTrigger} from 'react-bootstrap'
import axios from 'axios';


import {deleteBook,tradeRequest} from '../actions/bookactions'
import Controlpanel from './bookcontrol'

class Bookview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksList:[]
    }
  }
  componentDidMount() {
    let dbpath = (this.props.viewType==="All") ? "All" : this.props.user.user.userName

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

  booksDisplay(){

    let allDisplay = this.state.booksList.map((b,idx)=>{
      let booktitle,tooltip,owner,requested
      if(b.bookTitle.length>20){
        tooltip = (<Tooltip id="tooltip"><strong>{b.bookTitle}</strong></Tooltip>);
        booktitle = b.bookTitle.substr(0,20)+"..."
      }
      else{
        tooltip = (<Tooltip id="tooltip"><strong></strong></Tooltip>);
        booktitle = b.bookTitle
      }
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
              <h5 className="booktitle">{booktitle}</h5>
            </OverlayTrigger>
        </div>
      )
    })
    return allDisplay
  }
  removeBook(dbID){
    let bookListCopy = JSON.parse(JSON.stringify(this.state.booksList))
    let indexOfDeletion = bookListCopy.findIndex((b)=>{
      return b._id===dbID
    })
    bookListCopy =[...bookListCopy.slice(0,indexOfDeletion),...bookListCopy.slice(indexOfDeletion+1)]
    this.setState({
      booksList:bookListCopy
    },()=>deleteBook(dbID))
  }
  tradeBook(book){
    if(!this.props.user.user.userID){
      window.location='/login'
      return;
    }
    if(book.requested.length!==0){
      this.props.modalCallback(book.bookTitle+" is pending a trade request approval")
      return;
    }
    let tradeInfo ={
      requested:this.props.user.user.userName
    }
    tradeRequest(book._id,tradeInfo)
    .then((response)=>{
      //this.props.modalCallback("New Trade request for " + book.bookTitle)
      window.location='/mybooks'

    })
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
