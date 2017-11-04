"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {checkUser} from '../actions/authentication'

class Login extends React.Component{
    constructor(props){
      super(props)
    }
    componentDidMount(){
    }
    handleLogin(){
      //handle info from the form
      let email = findDOMNode(this.refs.email).value.trim()
      let pass = findDOMNode(this.refs.pass).value.trim()
      let logininfo={
        email:email,
        password:pass
      }
      this.props.checkUser(logininfo)
    }
    render(){
        return(
              <Grid>
                <Row>
                  <Col xs={8} xsOffset={2}>
                    <div className="text-center">
                      <h3> Login </h3>
                    </div>
                    <FormGroup controlId="formControlsEmail" type="text" >
                      <ControlLabel>Email</ControlLabel>
                      <FormControl ref="email" placeholder="Email"/>
                    </FormGroup>
                    <FormGroup controlId="formControlsPass" type="text" >
                      <ControlLabel>Password</ControlLabel>
                      <textarea className="form-control" rows="1" ref="pass" placeholder="Password"></textarea>
                    </FormGroup>
                    <Button block bsStyle="warning" type="submit" onClick={this.handleLogin.bind(this)}>Login</Button>
                  </Col>
                </Row>
              </Grid>
            )
      }
    }

function mapStateToProps(state){
  return state
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
          checkUser:checkUser
          }, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Login)
