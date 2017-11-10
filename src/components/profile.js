"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {updateProfile,getProfile} from '../actions/profileaction'
import {newPass} from '../actions/authentication'
import Info from './infomodal'

class Profile extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        message:"",//client interaction message
        profile:""
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.user.user.userID!==this.props.user.user.userID){
        getProfile(this.props.user.user.userID)
        .then((p)=>{
          this.setState({
            profile:p[0]
          })
        })
      }
    }
    handleProfile(){
      //handle info from the form
      let fullName = findDOMNode(this.refs.fullname).value.trim()
      let city = findDOMNode(this.refs.city).value.trim()
      let state = findDOMNode(this.refs.state).value.trim()
      fullName = fullName.length ? fullName : this.state.profile.fullName
      city = city.length ? city : this.state.profile.city
      state = state.length ? state : this.state.profile.state
      let profileinfo={
        _id:this.props.user.user.userID,
        fullName:fullName,
        city:city,
        state:state
      }
      updateProfile(profileinfo).then((response)=>{
        this.setState({
          message:"Profile Updated",
          profile:response
        })
      })
    }
    handlePassword(){
      //handle info from the form
      let oldPassword = findDOMNode(this.refs.oldPass).value.trim()
      let newPassword = findDOMNode(this.refs.newPass).value.trim()
      let passinfo={
        username:this.props.user.user.userName,
        password:oldPassword,
        newPassword:newPassword
      }
      newPass(passinfo).then((response)=>{
        this.setState({message:response.message},
          ()=>{
            findDOMNode(this.refs.oldPass).value="";
            findDOMNode(this.refs.newPass).value=""
          }
        )
      })
      .catch((err)=>{
        console.log(err)
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
                     <FormGroup controlId="formControlsFullname" type="text" >
                       <ControlLabel>Full Name</ControlLabel>
                       <FormControl ref="fullname" placeholder={this.state.profile.fullName}/>
                     </FormGroup>
                     <FormGroup controlId="formControlsEmail" type="text" >
                       <ControlLabel>City</ControlLabel>
                       <FormControl ref="city" placeholder={this.state.profile.city}/>
                     </FormGroup>
                     <FormGroup controlId="formControlsPass" type="text" >
                       <ControlLabel>State</ControlLabel>
                       <textarea className="form-control" rows="1" ref="state" placeholder={this.state.profile.state}></textarea>
                     </FormGroup>
                     <Button block bsStyle="warning" type="submit" onClick={this.handleProfile.bind(this)}>Update Profile</Button>
                   </Col>
                 </Row>
                 <Row>
                   <Col xs={8} xsOffset={2}>
                     <div className="text-center">
                       <h3> Update Password </h3>
                     </div>
                     <FormGroup controlId="oldPassword" type="text" >
                       <ControlLabel>Old Password</ControlLabel>
                       <FormControl ref="oldPass" placeholder="Old Password"/>
                     </FormGroup>
                     <FormGroup controlId="New Password" type="text" >
                       <ControlLabel>New Password</ControlLabel>
                       <FormControl ref="newPass" placeholder="New Password"/>
                     </FormGroup>
                     <Button block bsStyle="danger" type="submit" onClick={this.handlePassword.bind(this)}>Update Password</Button>
                   </Col>
                 </Row>
                 <Info message={this.state.message} reset={()=>this.setState({message:""})}/>
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
