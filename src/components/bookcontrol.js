import React, { Component } from 'react';
import {Col,Tooltip,Button,OverlayTrigger} from 'react-bootstrap'
class Controlpanel extends Component {

  render() {
    let cp,tooltip
    if(this.props.status!=="All"){
      tooltip = (<Tooltip id="tooltip"><strong>Delete Book</strong></Tooltip>);
      cp=(
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <span onClick={this.props.onDelete}><i className="fa fa-times delete" aria-hidden="true"></i></span>
        </OverlayTrigger>
      )
    }
    else if (this.props.status==="All" && !this.props.isOwner){

      if(this.props.isRequested){
        tooltip = (<Tooltip id="tooltip"><strong>Trade Pending</strong></Tooltip>);
        cp=(
          <OverlayTrigger placement="top" overlay={tooltip}>
            <span onClick={this.props.onTrade}><i className="fa fa-exchange trade-requested" aria-hidden="true"></i></span>
          </OverlayTrigger>
        )
      }
      else{
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
