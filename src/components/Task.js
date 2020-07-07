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
                <div className={"colorGreen"} id="icon-title" />
                <span >{task.name}</span>
                <i
                  id="delete"
                  className="far fa-trash-alt icon-delete"
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
                
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width="40pt"
                height="40pt"
                className="icon-dificult"
              >
                <rect
                  x="0"
                  y="1"
                  width="40"
                  height="4"
                  transform="matrix(1,0,0,1,0,0)"
                  fill="rgb(0,0,0)"
                />
                <rect
                  x="0"
                  y="9"
                  width="35"
                  height="4"
                  transform="matrix(1,0,0,1,0,0)"
                  fill="rgb(0,0,0)"
                />
                <rect
                  x="0"
                  y="17"
                  width="30"
                  height="4"
                  transform="matrix(1,0,0,1,0,0)"
                  fill="rgb(0,0,0)"
                />
                <rect
                  x="0"
                  y="25"
                  width="25"
                  height="4"
                  transform="matrix(1,0,0,1,0,0)"
                  fill="rgb(0,0,0)"
                />
                <rect
                  x="0"
                  y="33"
                  width="21"
                  height="4"
                  transform="matrix(1,0,0,1,0,0)"
                  fill="rgb(0,0,0)"
                />
              </svg>
              <span>
                <div className="number-dificult"> 1</div>
                <i className="far fa-comment icon-coment"></i>
                <div className="number-comment"> 1</div>
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
