"use strict"//component allows an existing user to login
import React from 'react'
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {checkUser} from '../../actions/authentication' //checks with server if user can be authorized
import Info from '../infomodal' // modal display

class Login extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        message:""//client interaction message
      }
    }
    handleLogin(){
      //handle login info from the form
      let user = findDOMNode(this.refs.uname).value.trim()
      let pass = findDOMNode(this.refs.pass).value.trim()
      let logininfo={
        username:user,
        password:pass
      }
      checkUser(logininfo).then((response)=>{//send authentication request to server
        if(response.status==="error"){
          this.setState({message:response.message})
        }
        else{//redirect to home page on a succesful login
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
                      <h3> Login </h3>
                    </div>
                    <FormGroup controlId="formControlsUsername" type="text" >
                      <ControlLabel>Username</ControlLabel>
                      <FormControl ref="uname" placeholder="Username"/>
                    </FormGroup>
                    <FormGroup controlId="formControlsPass" type="text" >
                      <ControlLabel>Password</ControlLabel>
                      <FormControl ref="pass" placeholder="Password"/>
                    </FormGroup>
                    <Button block bsStyle="warning" type="submit" onClick={this.handleLogin.bind(this)}>Login</Button>
                  </Col>
                </Row>
                <Info message={this.state.message} reset={()=>this.setState({message:""})}/>
              </Grid>
            )
      }
    }

export default (Login)
