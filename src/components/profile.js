"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {updateProfile} from '../actions/profileaction'
import Info from './infomodal'

class Profile extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        message:""//client interaction message
      }
    }
    handleProfile(){
      //handle info from the form
      let city = findDOMNode(this.refs.city).value.trim()
      let state = findDOMNode(this.refs.state).value.trim()
      let profileinfo={
        _id:this.props.user.user.userID,
        city:city,
        state:state
      }
      updateProfile(profileinfo).then((response)=>{
        console.log("Profile Updated")
      })
    }
    render(){
       if(this.props.user.user.userID){
         return(
               <Grid>
                 <Row>
                   <Col xs={8} xsOffset={2}>
                     <div className="text-center">
                       <h3> Update Profile </h3>
                     </div>
                     <FormGroup controlId="formControlsEmail" type="text" >
                       <ControlLabel>City</ControlLabel>
                       <FormControl ref="city" placeholder="City"/>
                     </FormGroup>
                     <FormGroup controlId="formControlsPass" type="text" >
                       <ControlLabel>State</ControlLabel>
                       <textarea className="form-control" rows="1" ref="state" placeholder="State"></textarea>
                     </FormGroup>
                     <Button block bsStyle="warning" type="submit" onClick={this.handleProfile.bind(this)}>Update Profile</Button>
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
export default connect(mapStateToProps)(Profile)
