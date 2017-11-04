"use strict"
//root of the frontend get /set primary store vars here
import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import Menu from './components/menu'
//action gets user info on every mount
import {getUser} from './actions/authentication';

class Main extends React.Component{
  componentDidMount(){
    console.log("CDM Mounted for Main")
    this.props.getUser()
  }
    render(){
      return (
        <div>
          <Menu/>
            {this.props.children}
        </div>
      )
    }
}

function mapStateToProps(state){
  return state
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
          getUser:getUser
          }, dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(Main)
