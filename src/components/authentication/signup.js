"use strict"//component allows a new user to sign up
import React from 'react'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {newUser} from '../../actions/authentication' // sends new user info the server for authentication
import Info from '../infomodal' // modal display

class Signup extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        message:""//client interaction message for modal
      }
    }
    handleNewSignUp(){
      //handle sign up from the form, using only username and password (standard for passport.js)
      let user = findDOMNode(this.refs.uname).value.trim()
      let pass = findDOMNode(this.refs.pass).value.trim()
      let signupinfo={
        username:user.toLowerCase(),//note change to lower case and make username aquisitions case insensitive
        password:pass
      }
      newUser(signupinfo).then((response)=>{//send info to server and ...
        if(response.status==="error"){//if sign up error...
          this.setState({message:response.message})
        }
        else{//...reroute to homepage on succesful sign up, had difficulty rerouting from
             // server since it is a post request so did it from client side
          window.location="/"
        }
      })
      .catch(function(err){
        this.setState({message:err})
      })
    }
    render(){
        return(
              <Grid>
                <Row>
                  <Col xs={8} xsOffset={2}>
                    <div className="text-center">
                      <h3> Sign Up </h3>
                    </div>
                    <FormGroup controlId="formControlsUsername" type="text" >
                      <ControlLabel>Username</ControlLabel>
                      <FormControl ref="uname" placeholder="Enter Username"/>
                    </FormGroup>
                    <FormGroup controlId="formControlsPass" type="text" >
                      <ControlLabel>Password</ControlLabel>
                      <FormControl ref="pass" placeholder="Enter Password"/>
                    </FormGroup>
                    <Button block bsStyle="warning" type="submit" onClick={this.handleNewSignUp.bind(this)}>Sign Up</Button>
                  </Col>
                </Row>
                <Info message={this.state.message} reset={()=>this.setState({message:""})}/>
              </Grid>
            )
      }
    }

export default (Signup)
