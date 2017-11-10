import React, { Component } from 'react';
import {Col,Row} from 'react-bootstrap'

import Bookview from './displaybooks'
import Info from './infomodal'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message:""
    }
  }
  doModal(m){
    this.setState({
      message:m
    })
  }
  render() {
    return (
      <div className="text-center">
        <h1 style={{color:"black"}}> All Books In Circulation</h1>
        <Bookview newBook={[]} viewType="All" modalCallback={(m)=>this.doModal(m)}/>
        <Info message={this.state.message}/>
      </div>
    );
  }

}

export default Home;
