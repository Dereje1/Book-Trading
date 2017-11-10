"use strict" //displays modal on user interaction
import React, { Component } from 'react';
import { Button,Modal} from 'react-bootstrap'

class Info extends Component {
  constructor(props) {
    super(props)
    //initialize modal show state to false
    this.state={
      show:false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if((prevProps.message!==this.props.message)&&(this.props.message.length)){//only show if new message in state (home)
      this.setState({
        show:true
      })
    }
  }
  open(){
  this.setState({
    show:true
  })
  }
  close(){
    this.setState({
      show: false
    },()=>this.props.reset());
  }
  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.close.bind(this)}
        container={this}
        aria-labelledby="contained-modal-title"
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title">{this.props.message}</Modal.Title>
      </Modal.Header>
    </Modal>
    );
  }

}

export default Info;
