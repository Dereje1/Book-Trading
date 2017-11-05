"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {newUser} from '../actions/authentication'
import Info from './infomodal'

class Signup extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        message:""//client interaction message
      }
    }
    handleNewSignUp(){
      //handle info from the form
      let email = findDOMNode(this.refs.email).value.trim()
      let pass = findDOMNode(this.refs.pass).value.trim()
      let signupinfo={
        email:email,
        password:pass
      }
      newUser(signupinfo).then((response)=>{
        if(response.status==="error"){
          this.setState({message:response.message})
        }
        else{
          window.location="/"
        }
      })
      .catch(function(err){
        console.log(err)
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
                    <FormGroup controlId="formControlsEmail" type="text" >
                      <ControlLabel>Email</ControlLabel>
                      <FormControl ref="email" placeholder="Enter Valid Email"/>
                    </FormGroup>
                    <FormGroup controlId="formControlsPass" type="text" >
                      <ControlLabel>Password</ControlLabel>
                      <textarea className="form-control" rows="1" ref="pass" placeholder="Enter Password"></textarea>
                    </FormGroup>
                    <Button block bsStyle="warning" type="submit" onClick={this.handleNewSignUp.bind(this)}>Sign Up</Button>
                  </Col>
                </Row>
                <Info message={this.state.message}/>
              </Grid>
            )
      }
    }

export default (Signup)
