"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import axios from 'axios';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {addBook} from '../actions/bookactions'
import Info from './infomodal'

class Books extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        booksearch:[],
        message:""//client interaction message
      }
    }
    populateBookSearch(){
      let formattedSearch = this.state.booksearch.map((b,idx)=>{
        return (
          <option key={idx} value={b[1]}>{b[0]}</option>
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
            return [b.volumeInfo.title,b.id]
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
      let bookId = findDOMNode(this.refs.selection).value.trim()
      console.log(bookId)
      let storeBookInfo = {
         user:       this.props.user.user.userEmail,
         volumeid:   bookId,
         traded:     false,
         requested:  "",
         timestamp:  Date.now()
      }
      addBook(storeBookInfo)

    }
    render(){
       if(this.props.user.user.userID){
         return(
               <Grid>
                 <Row>
                   <Col xs={12} md={6}>
                     <div className="text-center">
                       <h3> My Books </h3>
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
