"use strict" //home page for both authorized and unauthorized users
import React, { Component } from 'react';
import {Col,Row} from 'react-bootstrap'

import Bookview from './displaybooks'// component that displays books
import Info from './infomodal'// modal display

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:""
    }
  }
  doModal(m){// for call backs from child components , like control panel
    this.setState({
      message:m
    })
  }
  render() {
    return (
      <div className="text-center">
        <h2 style={{"paddingTop":"10px"}}> Books In Circulation</h2>
        <Bookview newBook={[]} viewType="All" modalCallback={(m)=>this.doModal(m)}/>
        <Info message={this.state.message} reset={()=>this.setState({message:""})}/>
      </div>
    );
  }

}

export default Home;
