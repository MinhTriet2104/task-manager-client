import React, { Component } from "react";
import { Tooltip } from "reactstrap";
import AddTask from "./forms/AddTask";

class Tooltips extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    return (
      <span>
        <i
          className="fas fa-question-circle icon-question customAddTask"
          id={"Tooltip-" + this.props.id}
          data-toggle="tooltip"
        ></i>
        <Tooltip
          placement={this.props.placement}
          isOpen={this.state.tooltipOpen}
          target={"Tooltip-" + this.props.id}
          toggle={this.toggle}
        >
          {this.props.content}
        </Tooltip>

        <AddTask laneId={this.props.id} laneTitle={this.props.laneTitle} />
      </span>
    );
  }
}
export default Tooltips;
