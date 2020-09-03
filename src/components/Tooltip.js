import React, { Component } from "react";
import AddTask from "./forms/addTask";

//style
import "../styles/Tooltip.scss";

class Tooltips extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <span>
        <i
          className="fas fa-times-circle icon-remove"
          onClick={() => this.props.removeLane()}
        ></i>

        <AddTask
          laneId={this.props.id}
          laneTitle={this.props.title}
          addCard={this.props.addCard}
        />
      </span>
    );
  }
}
export default Tooltips;
