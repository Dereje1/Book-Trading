"use strict"//component allows creation of new poll for and authenticated user
import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import {FormControl, FormGroup, Button, ControlLabel,Grid,Col,Row} from 'react-bootstrap'

import {newUser} from '../actions/authentication'

class Signup extends React.Component{
    constructor(props){
      super(props)

    }
    componentDidMount(){
    }
    handleNewSignUp(){
      //handle info from the form
      let email = findDOMNode(this.refs.email).value.trim()
      let pass = findDOMNode(this.refs.pass).value.trim()
      let signupinfo={
        email:email,
        password:pass
      }
      this.props.newUser(signupinfo)
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
              </Grid>
            )
      }
    }

function mapStateToProps(state){
  return state
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
          newUser:newUser
          }, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Signup)
