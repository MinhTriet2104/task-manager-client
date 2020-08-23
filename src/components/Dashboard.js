import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Route, Switch, Link } from "react-router-dom";
import classNames from "classnames";

// components
import Board from "./Board";
import ChatBox from "./ChatBox/ChatBox";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";
//style
import "../styles/Dashboard.scss";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      projects: [],
      loading: true,
      match: "board",
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
          err: e,
        });
      });
  };

  render() {
    const { projects, loading } = this.state;
    const { globalMatch } = this.props;

    let projectList;
    let header;

    if (!loading) {
      let projectId = globalMatch.params.id;

      header = <Header projectId={projectId} match={this.state.match} />;

      projectList = projects.map((project, index) => {
        return (
          <li key={index}>
            <Link
              to={`/project/${project._id}/board`}
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

      header = (
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
          {header}
          <aside style={{ height: "calc(100vh - 58px)" }}>
            <Switch>
              <Route
                exact
                path="/project"
                component={() => <h2>Select a Project</h2>}
              />
              <Route path="/project/:id/board" component={Board} />
              <Route path="/project/:id/chatbox" component={ChatBox} />
            </Switch>
          </aside>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  project: state.project,
  globalMatch: state.globalMatch,
});

export default connect(mapStateToProps, null)(Dashboard);
