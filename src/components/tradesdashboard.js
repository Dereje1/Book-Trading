"use strict" //displays status of trades
import React, { Component } from 'react';
import axios from 'axios';
import {Accordion, Panel} from 'react-bootstrap'
import {tradeRequest} from '../actions/bookactions'
class Trades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booksIRequested:[],
      booksForApproval:[]
    }
  }
  componentDidMount() {
    axios.get('/api/All')//get all books to see status of requests/requested
    .then((response)=>{
      //my requets array are simply all books that contain users requeted in the
      //requested fields of the document
      let myRequestArr= response.data.filter((b)=>{
        return (b.requested===this.props.currentUser)
      })
      //pending approval books are books that (1) have a requested status
      //(2) that those requests are not ones made by currentUser (not really necessary because a user
      //can not request his own books but just put in there for safety) and (3) match owner field with user
      let approvalArr = response.data.filter((b)=>{
        if (b.requested!==""){
          if(b.requested!==this.props.currentUser){
            if(b.owner===this.props.currentUser){
              return b
            }
          }
        }
      })
      this.setState({//set client state accordingly
        booksIRequested:myRequestArr,
        booksForApproval:approvalArr
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  myRequests(){//displays users request
    let myRequestsFormatted = this.state.booksIRequested.map((b)=>{
      return(
          <ul key={b._id} className="list-group">
            <span>{b.bookTitle + "\n" +  "Owner: " + b.owner}</span>
            <span><i className="fa fa-times delete" onClick={()=>{this.cancelRequest(b._id)}} aria-hidden="true"></i></span>
          </ul>
        )
    })
    return(
      <Accordion id="myrequests" style={{"marginTop":"10px"}}>
        <Panel className="panel" header={"My Pending Requests ("+myRequestsFormatted.length+")"} eventKey={1}>
          {myRequestsFormatted}
        </Panel>
      </Accordion>
    )
  }
  requestApprovals(){//displays books requested from user
    let approvalRequestsFormatted = this.state.booksForApproval.map((b)=>{
      return(

          <ul key={b._id} className="list-group">
            <span>{b.bookTitle + "\n" + "Requested By: " + b.requested}</span>
            <span><span style={{"marginRight":"10px"}}><i className="fa fa-check approve" onClick={()=>{this.approveRequest(b)}} aria-hidden="true"></i></span>
            <span><i className="fa fa-times delete" onClick={()=>{this.denyRequest(b._id)}} aria-hidden="true"></i></span></span>
          </ul>
      )
    })
    return(
      <Accordion id="myrequests" style={{"marginTop":"10px"}}>
        <Panel className="panel" header={"Requests For Approval ("+approvalRequestsFormatted.length+")"} eventKey={1}>
          {approvalRequestsFormatted}
        </Panel>
      </Accordion>
    )
  }
  //not all pending trade transactions go thru only one traderequest crud
  cancelRequest(dbId){//cancels a reuest that the authenticated user has made before it has been approved
    let tradeInfo ={
      requested:""
    }
    let copyOfBooks = JSON.parse(JSON.stringify(this.state.booksIRequested))
    let indexOfDeletion = copyOfBooks.findIndex((b)=>{
      return (b._id === dbId)
    })
    copyOfBooks = [...copyOfBooks.slice(0,indexOfDeletion),...copyOfBooks.slice(indexOfDeletion+1)]
    this.setState({
      booksIRequested:copyOfBooks
    },()=>{tradeRequest(dbId,tradeInfo)})
  }
  denyRequest(dbId){//denies a reuest
    let tradeInfo ={
      requested:""
    }
    let copyOfBooks = JSON.parse(JSON.stringify(this.state.booksForApproval))
    let indexOfDeletion = copyOfBooks.findIndex((b)=>{
      return (b._id === dbId)
    })
    copyOfBooks = [...copyOfBooks.slice(0,indexOfDeletion),...copyOfBooks.slice(indexOfDeletion+1)]
    this.setState({
      booksForApproval:copyOfBooks
    },()=>{tradeRequest(dbId,tradeInfo)})
  }
  approveRequest(book){
    this.props.swapped(book._id)
    let tradeInfo ={//note owner field notifies server to swap book owners
      requested:"",
      owner:book.requested
    }
    let copyOfBooks = JSON.parse(JSON.stringify(this.state.booksForApproval))
    let indexOfDeletion = copyOfBooks.findIndex((b)=>{
      return (b._id === book._id)
    })
    copyOfBooks = [...copyOfBooks.slice(0,indexOfDeletion),...copyOfBooks.slice(indexOfDeletion+1)]

    this.setState({
      booksForApproval:copyOfBooks
    },()=>{tradeRequest(book._id,tradeInfo)})
  }
  render() {
    return (
      <div>
        <div>{this.myRequests()}</div>
        <div>{this.requestApprovals()}</div>
      </div>
    );
  }

}

export default Trades;
