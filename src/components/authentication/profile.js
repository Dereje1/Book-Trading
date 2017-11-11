"use strict"//component updates user profile and changes password
import React from 'react'
import {connect} from 'react-redux'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {updateProfile,getProfile} from '../../actions/profileaction' //update and get profiles
import {newPass} from '../../actions/authentication' //changes password
import Info from '../infomodal' // modal display

//note that authentication information and profile information do not share the same collection
//they however share same userID that is generated from when the user first signs up
class Profile extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        message:"",//client interaction message
        profile:{   fullName:"undefined", //update client profile state to reflect any changes
           city:  "undefined",
           state: "undefined"}
      }
    }

    componentDidUpdate(prevProps, prevState) {
      //pull profile data on main userId change, happens on every load as user is not first
      //defined before the retrieval from the redux store
      if(prevProps.user.user.userID!==this.props.user.user.userID){
        getProfile(this.props.user.user.userID)
        .then((p)=>{
          if(p.length){//make sure response has length as it first returns an empty array
            this.setState({
              profile:p[0]
            })
          }
        })
      }
    }
    handleProfile(){
      //handle any profile change here
      let fullName = findDOMNode(this.refs.fullname).value.trim()
      let city = findDOMNode(this.refs.city).value.trim()
      let state = findDOMNode(this.refs.state).value.trim()
      //make sure not to send any empty fields to server
      fullName = fullName.length ? fullName : this.state.profile.fullName
      city = city.length ? city : this.state.profile.city
      state = state.length ? state : this.state.profile.state
      let profileinfo={
        _id:this.props.user.user.userID,
        fullName:fullName,
        city:city,
        state:state
      }
      updateProfile(profileinfo).then((response)=>{//send update in server and then update client state
        this.setState({
          message:"Profile Updated",
          profile:response
        })
      })
    }
    handlePassword(){
      //handles the password change
      let oldPassword = findDOMNode(this.refs.oldPass).value.trim()
      let newPassword = findDOMNode(this.refs.newPass).value.trim()
      let passinfo={
        username:this.props.user.user.userName,
        password:oldPassword,
        newPassword:newPassword
      }
      newPass(passinfo).then((response)=>{//send change request to server
        this.setState({message:response.message},
          ()=>{//clear out fields after change/denial
            findDOMNode(this.refs.oldPass).value="";
            findDOMNode(this.refs.newPass).value=""
          }
        )
      })
      .catch((err)=>{
        this.setState({message:err})
      })
    }
    render(){
       if(this.props.user.user.userID){//only render this page for an authorized user
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
           else{//deny access for unauthorized users
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
export default connect(mapStateToProps)(Profile)
