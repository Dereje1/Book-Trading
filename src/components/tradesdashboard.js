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
    axios.get('/api/All')
    .then((response)=>{
      let myRequestArr= response.data.filter((b)=>{
        return (b.requested===this.props.currentUser)
      })

      let approvalArr = response.data.filter((b)=>{
        if (b.requested!==""){
          if(b.requested!==this.props.currentUser){
            if(b.owner===this.props.currentUser){
              return b
            }
          }
        }
      })
      this.setState({
        booksIRequested:myRequestArr,
        booksForApproval:approvalArr
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  myRequests(){
    let myRequestsFormatted = this.state.booksIRequested.map((b)=>{
      return(
          <ul key={b._id} className="list-group">
            <span>{"Title: " + b.bookTitle + ", Owner: " + b.owner}</span>
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
  requestApprovals(){
    let approvalRequestsFormatted = this.state.booksForApproval.map((b)=>{
      return(

          <ul key={b._id} className="list-group">
            <span>{"Title: " + b.bookTitle + ", Requested By: " + b.requested}</span>
            <span><i className="fa fa-check approve" onClick={()=>{this.approveRequest(b)}} aria-hidden="true"></i></span>
            <span><i className="fa fa-times delete" onClick={()=>{this.denyRequest(b._id)}} aria-hidden="true"></i></span>
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
  cancelRequest(dbId){
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
  denyRequest(dbId){
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
    let tradeInfo ={
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
