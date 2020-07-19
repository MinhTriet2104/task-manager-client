import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
// import axios from "axios";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import Loader from "./Loader";

import { deleteTaskRequest, updateStatusTaskRequest } from "../actions/index";

class Task extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tasks: [],
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tasks !== prevState.tasks) {
      return { tasks: nextProps.tasks };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tasks !== this.state.tasks) {
      const me = this;
      this.setState({
        tasks: me.props.tasks,
      });

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

          const { tasks } = me.state;
          const status = +this.getAttribute("status");
          const taskId = [...this.childNodes].find(
            (child) => child.tagName === "LI"
          ).id;

          me.props.updateStatusTaskRequest(taskId, status);

          const findItem = tasks.find((item) => item._id === taskId);
          const index = tasks.indexOf(findItem);
          me.setState({
            tasks: [
              ...tasks.slice(0, index),
              {
                ...findItem,
                status: status,
              },
              ...tasks.slice(index + 1),
            ],
          });
        },
      });
    }
  }

  handleDelete = async (id) => {
    this.props.deleteTaskRequest(id);
    const { tasks } = this.state;
    const findItem = tasks.find((item) => item._id === id);
    const index = tasks.indexOf(findItem);
    this.setState(
      {
        tasks: [...tasks.slice(0, index), ...tasks.slice(index + 1)],
      },
      () => alert("Deleted")
    );
  };

  render() {
    const { loading, filter } = this.props;
    const { tasks } = this.state;
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
                <div className={"colorGreen icon-title"} />
                <span>{task.name}</span>
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
                  {moment(task.dueDate).format("DD/MM/YYYY")}
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
  updateStatusTaskRequest: (id, status) =>
    dispatch(updateStatusTaskRequest(id, status)),
});

export default connect(null, mapDispatchToProps)(Task);
