import React, { Component } from 'react';
import {Col,Tooltip,Button,OverlayTrigger} from 'react-bootstrap'
class Controlpanel extends Component {

  render() {
    let cp,tooltip //prepare for conditional tooltip and control panel rendering
    if(this.props.status!=="All"){//display for authenticated users only
      tooltip = (<Tooltip id="tooltip"><strong>Delete Book</strong></Tooltip>);
      cp=(
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <span onClick={this.props.onDelete}><i className="fa fa-times delete" aria-hidden="true"></i></span>
        </OverlayTrigger>
      )
    }
    else if (this.props.status==="All" && !this.props.isOwner){//for all non-authenticated users

      if(this.props.isRequested){//for books with pending trade requests
        tooltip = (<Tooltip id="tooltip"><strong>Trade Pending</strong></Tooltip>);
        cp=(
          <OverlayTrigger placement="top" overlay={tooltip}>
            <span onClick={this.props.onTrade}><i className="fa fa-exchange trade-requested" aria-hidden="true"></i></span>
          </OverlayTrigger>
        )
      }
      else{//for all other books
        tooltip = (<Tooltip id="tooltip"><strong>Request a Trade</strong></Tooltip>);
        cp=(
          <OverlayTrigger placement="top" overlay={tooltip}>
            <span onClick={this.props.onTrade}><i className="fa fa-exchange trade" aria-hidden="true"></i></span>
          </OverlayTrigger>
        )
      }
    }
    return (
      <div>{cp}</div>
    );
  }

}

export default Controlpanel;
