"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import axios from 'axios';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {addBook} from '../actions/bookactions'
import Info from './infomodal'
import Bookview from './displaybooks'
import Trades from './tradesdashboard'
class Books extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        booksearch:[],
        addedBook:[],
        swappingId:"",
        message:""//client interaction message
      }
    }
    populateBookSearch(){
      let formattedSearch = this.state.booksearch.map((b,idx)=>{
        return (
          <option key={idx} value={JSON.stringify(b)}>{b[0].title}</option>
        )
      })
      return formattedSearch
    }
    mykeydown(){
      //console.log(this.timerID)
      clearTimeout(this.timerID)
    }
    searchResults(){
      //console.log(this.timerID)
      this.setState({
        booksearch:[]
      })
      let bookSearched = findDOMNode(this.refs.search).value.trim()
      //console.log(e,bookSearched)
      if(!bookSearched.length){return}
      let urlBuild = "https://www.googleapis.com/books/v1/volumes?q=" + bookSearched
      this.timerID = setTimeout(()=>{
        axios.get(urlBuild)
        .then((response)=>{
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
    addBook(){
      //handle info from the form
      let book = findDOMNode(this.refs.selection).value
      book = (JSON.parse(book))
      console.log(book)
      let storeBookInfo = {
         owner:       this.props.user.user.userEmail,
         volumeid:   book[1],
         traded:     false,
         requested:  "",
         timestamp:  Date.now(),
         imgLink : book[0].imageLinks.thumbnail,
         previewLink: book[0].previewLink,
         bookTitle : book[0].title
      }

      this.setState({
        addedBook:[storeBookInfo]
      },()=>addBook(storeBookInfo))
    }
    swapping(sID){
      this.setState({
        swappingId:sID
      })
    }
    render(){
       if(this.props.user.user.userID){
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
                     <Trades currentUser={this.props.user.user.userEmail} swapped={(s)=>this.swapping(s)}/>
                   </Col>
                   <Col xs={12} md={6}>
                       <div className="text-center">
                         <h3> My Books </h3>
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
                 <Row>
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
