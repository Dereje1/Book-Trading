"use strict"//authenticated user book collection/addition/display and control
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import axios from 'axios';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {addBook} from '../actions/bookactions' //adds book to db
import Info from './infomodal'// modal display
import Bookview from './displaybooks' //calls component customised for mybooks display
import Trades from './tradesdashboard'//pending trades dashboard
class Books extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        booksearch:[],//for updating google books seacrh on the fly
        addedBook:[],//newly addedbooks are collected here for client side rendering
        swappingId:"",//need this for client side rendering
        message:""//client interaction message
      }
    }
    populateBookSearch(){//poulates the selection box with books returned from google
      let formattedSearch = this.state.booksearch.map((b,idx)=>{
        let authors ="";
        if(b[0].authors){
          authors = b[0].authors.join(',')
        }
        return (
          <option key={idx} value={JSON.stringify(b)}>{b[0].title + " - " + authors}</option>
        )
      })
      return formattedSearch
    }
    mykeydown(){//need to clear the time out on every key press
      //console.log(this.timerID)
      clearTimeout(this.timerID)
    }
    searchResults(){//searchs google books
      //console.log(this.timerID)
      this.setState({
        booksearch:[]//empty out search arr
      })
      let bookSearched = findDOMNode(this.refs.search).value.trim()

      if(!bookSearched.length){return}//do nothing for an empty search
      let urlBuild = "https://www.googleapis.com/books/v1/volumes?q=" + bookSearched
      this.timerID = setTimeout(()=>{//after experimenting google books api erros out on too many
        //requets at once so put on a 1 second timer
        axios.get(urlBuild)
        .then((response)=>{//if succesful parse response from google and set client state
          let parsedData = response.data.items.map((b)=>{
            return [b.volumeInfo,b.id]
          })
          this.setState({
            booksearch:parsedData
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      },1000)
    }
    addBook(){//lets client add a book from selection box
      let book = findDOMNode(this.refs.selection).value
      book = (JSON.parse(book))//note storing value as string other wise can not retireve
      //convert to img link to https to avoid console mixed content warning
      let imglinkHttps = book[0].imageLinks.thumbnail.split(":")[0]+"s:"+book[0].imageLinks.thumbnail.split(":")[1]
      let storeBookInfo = {//prepare to send to db
         owner:       this.props.user.user.userName,
         volumeid:   book[1],
         traded:     false,
         requested:  "",
         timestamp:  Date.now(),
         imgLink : imglinkHttps,
         previewLink: book[0].previewLink,
         bookTitle : book[0].title
      }
      addBook(storeBookInfo)
      .then((b)=>{
        //note that I am adding book first in the db and then setting the
        //state unlike most other operations this order is important
        //since if the user does not refresh there will be an error on deletion as
        //database was never updated
        this.setState({
          addedBook:[b]
        })
      })

    }
    swapping(sID){//called on an approval fo a book swap
      this.setState({
        swappingId:sID
      })
    }
    render(){
       if(this.props.user.user.userID){//only for authenticated users
         return(
               <Grid>
                 <Row>
                   <Col xs={12} md={6}>
                     <div className="text-center">
                       <h3>Search and Add Books</h3>
                     </div>
                     <FormGroup controlId="formBookAdd" type="text" >
                       <ControlLabel>Search Google Books</ControlLabel>
                       <FormControl ref="search" placeholder="Enter Search Terms" onKeyDown={this.mykeydown.bind(this)} onKeyUp={this.searchResults.bind(this)}/>
                     </FormGroup>
                     <FormGroup controlId="formControlsSelect">
                      <ControlLabel>Select Book</ControlLabel>
                      <FormControl ref="selection" componentClass="select" placeholder="select">
                        {this.populateBookSearch()}
                      </FormControl>
                    </FormGroup>
                     <Button block bsStyle="warning" type="submit" onClick={this.addBook.bind(this)}>Add Book</Button>
                       <div className="text-center">
                         <h3>Trade DashBoard </h3>
                       </div>
                     <Trades currentUser={this.props.user.user.userName} swapped={(s)=>this.swapping(s)}/>
                   </Col>
                   <Col xs={12} md={6}>
                       <div className="text-center">
                         <h3> Books I Own </h3>
                       </div>
                      <Bookview newBook={this.state.addedBook} viewType="user" swap={this.state.swappingId}/>
                   </Col>
                 </Row>
                 <Info message={this.state.message}/>
               </Grid>
             )
           }
           else{
             return(
               <Grid>
                 <Row className="text-center">
                   <Col xs={8} xsOffset={2}>
                        <h1> Access Denied!!</h1>
                   </Col>
                 </Row>
               </Grid>
             )
           }

      }
    }
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(Books)
