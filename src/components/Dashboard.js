import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Project from "./Project";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";

import { setLoadingProject } from "../actions/index";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      show: true,
      projects: [],
      err: "",
      // err2: "",
      // loading: true,
      // loadingProject: true,
    };

    this.getProjects = this.getProjects.bind(this);
  }

  componentDidMount = () => {
    // this.getStoryDetails();
    this.getProjects();
    // setInterval(() => {
    //   this.getData();
    // }, 2000);
  };

  getProjects = () => {
    axios
      .get(`http://localhost:2104/project`)
      .then((r) => {
        console.log("getProjects", r.data);
        this.setState({
          projects: r.data,
          err: "",
        });
      })
      .then(() => {
        this.props.setLoadingProject(false);
      })
      .catch((e) => {
        this.props.setLoadingProject(true);
      });
  };

  render() {
    let { projects } = this.state;
    const { match, loadingProject } = this.props;
    let storyTable, projectRender;

    if (!loadingProject) {
      const projectId = projects.find(
        (project) => project._id === match.params.id
      )._id;

      storyTable = projects.map((project, index) => {
        return (
          <li key={index}>
            <Link
              to={`/project/${projectId}`}
              className={classNames({ active: projectId === match.params.id })}
            >
              <i className="fas fa-list-alt"></i>
              <span className="menu-text">{project.name}</span>
            </Link>
          </li>
        );
      });

      projectRender = (
        <Project
          projectId={projectId}
          // storyType={this.props.params.id}
          // tasks={this.state.tasks}
          // loading={this.state.loading}
        />
      );
    } else {
      storyTable = (
        <li>
          <div className="loader">
            <Loader />
          </div>
        </li>
      );

      projectRender = (
        <li>
          <div className="loader">
            <Loader />
          </div>
        </li>
      );
    }

    return (
      <div>
        <div className="side">
          <span className="logo">Task Manager</span>
          <ul className="side-menu">{storyTable}</ul>
          <div className="otherMenu">
            <AddStory />
          </div>
        </div>
        <div className="con">
          <Header />
          <aside>{projectRender}</aside>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingProject: state.loading.loadingProject,
});

const mapDispatchToProps = (dispatch) => ({
  setLoadingProject: (status) => dispatch(setLoadingProject(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
