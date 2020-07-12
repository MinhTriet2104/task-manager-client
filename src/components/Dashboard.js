import React, { Component } from "react";
import axios from "axios";
import { Route, Switch, Link } from "react-router-dom";
import classNames from "classnames";

// components
import Board from "./Board";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      projects: [],
      loading: true,
      err: "",
    };
  }

  componentDidMount = () => {
    this.getProjects();
  };

  getProjects = () => {
    axios
      .get(`http://localhost:2104/project`)
      .then((r) => {
        console.log("getProjects", r.data);
        this.setState({
          projects: r.data,
          loading: false,
          err: "",
        });
      })
      .catch((e) => {
        this.setState({
          loading: true,
        });
      });
  };

  render() {
    const { projects, loading } = this.state;
    const { project } = this.props;
    let projectList;

    if (!loading) {
      let projectId;
      if (project) projectId = project._id;

      projectList = projects.map((project, index) => {
        return (
          <li key={index}>
            <Link
              to={`/project/${project._id}`}
              className={classNames({
                active: project._id === projectId,
              })}
            >
              <i className="fas fa-list-alt"></i>
              <span className="menu-text">{project.name}</span>
            </Link>
          </li>
        );
      });
    } else {
      projectList = (
        <li>
          <div className="loader">
            <Loader />
          </div>
        </li>
      );
    }

    return (
      <div style={{ position: "relative" }}>
        <div className="side">
          <span className="logo">Task Manager</span>
          <ul className="side-menu">{projectList}</ul>
          <div className="otherMenu">
            <AddStory />
          </div>
        </div>
        <div className="con">
          <Header />
          <aside>
            <Switch>
              <Route
                path="/project"
                exact
                component={() => <h2>Select a Project</h2>}
              />
              <Route path="/project/:id" component={Board} />
            </Switch>
          </aside>
        </div>
      </div>
    );
  }
}

export default Dashboard;
