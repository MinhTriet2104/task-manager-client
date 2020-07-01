import React, { Component } from "react";

import moment from "moment";
// import ModalExampleDimmer from "./modal";
import axios from "axios";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import Loader from "./Loader";

class Task extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
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
    axios
      .delete("http://localhost:2104/task/" + id)
      .then(function (response) {
        if (response.status === 200) alert("Deleted");
        console.log(response);
      })
      .then(() => {})
      .catch(function (error) {
        console.log(error);
      });
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
export default Task;
