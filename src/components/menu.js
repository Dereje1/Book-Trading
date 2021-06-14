"use strict"; //navigation bar self explanatory
import React from "react";
import { connect } from "react-redux";
import { Nav, NavItem, Navbar, Button } from "react-bootstrap";
import { getUser } from "../actions/authentication";

const actionCreators = {
  getUser,
};

class Menu extends React.Component {
  componentDidMount() {
    console.log("CDM Mounted for Menu");
    this.props.getUser();
  }

  conditionalNav() {
    let autenticationStatus = this.props.user.user.authenticated;
    if (autenticationStatus) {
      //the way response comes of user is in string I can change this to JSON response in the future
      return (
        <Nav pullRight>
          <NavItem eventKey={2} href="/">
            Home
          </NavItem>
          <NavItem eventKey={3} href="/mybooks">
            My Books
          </NavItem>
          <NavItem eventKey={4} href="/profileadd">
            Profile
          </NavItem>
          <NavItem eventKey={5} href="/auth/logout">
            Logout @ {this.props.user.user.userName}
          </NavItem>
        </Nav>
      );
    } else {
      return (
        <Nav pullRight>
          <NavItem eventKey={2} href="/">
            Home
          </NavItem>
          <NavItem eventKey={4} href="/login">
            Login
          </NavItem>
          <NavItem eventKey={3} href="/signup">
            Sign Up
          </NavItem>
        </Nav>
      );
    }
  }

  render() {
    let bcolor = this.props.user.user.authenticated ? "#7ef74a" : "white";
    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" style={{ color: bcolor }}>
              Book Trading App
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/about">
              About
            </NavItem>
          </Nav>
          {this.conditionalNav()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
function mapStateToProps(state) {
  return state;
}
//only reads store state does not write to it
export default connect(mapStateToProps, actionCreators)(Menu);
