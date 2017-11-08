import React, { Component } from 'react';
import {Col,Row} from 'react-bootstrap'

import Bookview from './displaybooks'
class Home extends Component {

  render() {
    return (
      <Row className="text-center">
        <h1> All Books In Circulation</h1>
        <Bookview newBook={[]} user="All"/>
      </Row>
    );
  }

}

export default Home;
