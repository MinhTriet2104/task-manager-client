import React, { Component } from "react";
// import axios from "axios";
import { connect } from "react-redux";

import Task from "./Task";
import Tooltips from "./Tooltip";

import { getProject } from "../actions/index";

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // project: {},
      err: "",
      loading: true,
    };

    this.getProjectAndTasks = this.getProjectAndTasks.bind(this);
  }

  componentDidMount = () => {
    this.getProjectAndTasks();
  };

  componentDidUpdate = (prevProps) => {
    // this.getStoryDetails();
    if (this.props.projectId !== prevProps.projectId) this.getProjectAndTasks();
    // setInterval(() => {
    //   this.getData();
    // }, 2000);
  };

  getProjectAndTasks = () => {
    this.props.getProject(this.props.projectId);
    this.setState({
      loading: false,
    });
    // axios
    //   .get(`http://localhost:2104/project/${this.props.projectId}`)
    //   .then((r) => {
    //     console.log("getProjectAndTasks:", r.data);
    //     this.setState({
    //       project: r.data,
    //       err: "",
    //     });
    //     this.props.setTasks(r.data.tasks);
    //     return r.data;
    //   })
    //   .then(({ tasks }) => {
    //     this.setState({
    //       tasks: this.props.tasks,
    //       loading: false,
    //     });
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     if (!e.response) {
    //       this.setState({
    //         loading: true,
    //         err: e,
    //       });
    //     } else
    //       this.setState({
    //         loading: true,
    //         err: e,
    //       });
    //   });
  };

  render() {
    const { tasks } = this.props;

    return (
      <div className="container">
        <div className="space">
          <h2 className="story">
            {this.props.project ? this.props.project.name : "Loading..."}
          </h2>
        </div>
        <div className="row">
          <div className="col-sm mcell mcolor1">
            <div className="mcell-title story">
              <b className="fas fa-lightbulb" /> Backlog
              <Tooltips
                id="1"
                content="You can do what you want to do with this column"
                placement="top"
                projectId={this.props.projectId}
              />
            </div>
            <Task tasks={tasks} loading={this.state.loading} filter="1" />
            <button className="btnAdd">
              <i className="fas fa-plus customAddTask btn-icon"></i>
              Add a task{" "}
            </button>
          </div>
          <div className="col-sm mcell mcolor2">
            <div className="mcell-title story">
              <b className="fas fa-bars" /> TODO
              <Tooltips
                id="2"
                content="You can do what you want to do with this column"
                placement="top"
                projectId={this.props.projectId}
              />
            </div>
            <Task tasks={tasks} loading={this.state.loading} filter="2" />
            <button className="btnAdd">
              <i className="fas fa-plus customAddTask btn-icon"></i>
              Add a task{" "}
            </button>
          </div>

          <div className="col-sm mcell mcolor3">
            <div className="mcell-title story">
              <b className="fas fa-spinner"></b> In Progress
              <Tooltips
                id="3"
                content="You can do what you want to do with this column"
                placement="top"
                projectId={this.props.projectId}
              />{" "}
            </div>
            <Task tasks={tasks} loading={this.state.loading} filter="3" />
            <button className="btnAdd">
              <i className="fas fa-plus customAddTask btn-icon"></i>
              Add a task{" "}
            </button>
          </div>
          <div className="col-sm mcell mcolor4">
            <div className="mcell-title story">
              <b className="fas fa-check" /> Done
              <Tooltips
                id="4"
                content="You can do what you want to do with this column"
                placement="top"
                projectId={this.props.projectId}
              />{" "}
            </div>
            <Task tasks={tasks} loading={this.state.loading} filter="4" />
            <button className="btnAdd">
              <i className="fas fa-plus customAddTask btn-icon"></i>
              Add a task{" "}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  project: state.project,
  tasks: state.tasks,
});

const mapDispatchToProps = (dispatch) => ({
  getProject: (id) => dispatch(getProject(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
