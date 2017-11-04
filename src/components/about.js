"use strict"//dumb Component about page
import React from 'react'
import { Button,Modal,Table} from 'react-bootstrap'//not modal shows warnings in console should be fixed with next update

class About extends React.Component{
  constructor(props) {
    super(props)
    //initialize modal state and assign params on open
    this.state={
      show:true
    }
  }
  open(){
    //when modal is opened note edit info coming from the props of this class as an array
    //of the ingredients and recipe name for active recipe
    this.setState({
      show:true
    })
  }
  close(){
    //when modal is closed reset back to original state
    this.setState({
      show: false
    },this.props.router.push('/'));
  }
  render(){
    return(
      <Modal
        show={this.state.show}
        onHide={this.close.bind(this)}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Night Life Coordination App</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Coded by <a href="https://www.freecodecamp.com/dereje1" target="_blank">DGetahun</a> with JavaScript.</h5>
          <br></br>
          <Table responsive>
              <thead>
                <tr>
                  <th>Front End</th>
                  <th>Back End</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>React / Redux</td>
                  <td> Express / Node.js</td>
                </tr>
                <tr>
                  <td>Redux-Thunk</td>
                  <td>Mongoose / Mongodb</td>
                </tr>
                <tr>
                  <td>React-Bootstrap</td>
                  <td>Passport.js</td>
                </tr>
              </tbody>
            </Table>
          <h5> Data Sources:</h5>
          <ul>
            <li><a href="https://www.yelp.com/developers/documentation/v3/get_started" target="_blank">Yelp Fusion API</a></li>
            <li><a href="https://freegeoip.net/?q=2601:14d:8602:7460:cdf5:63c2:c2c:5fa8" target="_blank">freegeoip.net Geolocation API</a></li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <h6 className="pull-left">Source Code @ <a href="https://github.com/Dereje1/Night-Life" target="_blank">Github</a></h6>
          <Button onClick={this.close.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>

    )
  }
}

export default About
