import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
// import axios from "axios";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import Loader from "./Loader";

import { deleteTaskRequest } from "../actions/index";

class Task extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tasks !== prevProps.tasks) {
      $(".mcell-task").draggable({
        appendTo: "body",
        cursor: "move",
        helper: "clone",
        revert: "invalid",
      });

      $(".mcell").droppable({
        tolerance: "intersect",
        accept: ".mcell-task",
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        drop: function (event, ui) {
          $(this).append($(ui.draggable));
          console.log($(this).find("li").attr("id"));
        },
      });
    }
  }

  handleDelete = (id) => {
    this.props.deleteTaskRequest(id);
    alert("Deleted");
  };

  render() {
    const { tasks, loading, filter } = this.props;
    let content;

    if (loading) {
      content = (
        <div className="loader">
          <Loader />
        </div>
      );
    } else {
      content = tasks
        .filter((task) => task.status === Number(filter))
        .map((task, index) => {
          return (
            <li id={task._id} className="mcell-task" key={index}>
              <span className="task-name">
                <span>{task.name}</span>
                <i
                  id="delete"
                  className="fas fa-times"
                  onClick={() => this.handleDelete(task._id)}
                ></i>
              </span>
              <span className="task-details">
                {task.description
                  ? task.description
                  : "This task don't have description"}
              </span>
              <div>
                <span className="task-due">
                  {moment(task.dueDate).format("DD.MM.YYYY")}
                </span>
                <span className="task-contributors">
                  <img
                    alt={task.assignee.username}
                    title={task.assignee.username}
                    src={
                      task.assignee.avatar
                        ? task.assignee.avatar
                        : "https://i.imgur.com/5bh5qpe.jpg"
                    }
                  />
                </span>
              </div>
              <div className={"colorGreen"} />
              {/* <ModalExampleDimmer propContent={task} classType="btnDashboard" /> */}
            </li>
          );
        });
    }
    return <div className="process">{content}</div>;
  }
}

// const mapStateToProps = (state) => ({
//   tasks: state.tasks,
// });

const mapDispatchToProps = (dispatch) => ({
  deleteTaskRequest: (id) => dispatch(deleteTaskRequest(id)),
});

export default connect(null, mapDispatchToProps)(Task);
