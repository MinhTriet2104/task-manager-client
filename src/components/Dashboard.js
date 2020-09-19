import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Route, Switch, Link } from "react-router-dom";
import classNames from "classnames";

// components
import MainSection from "./MainSection";
import Board from "./Board";
import ChatBox from "./ChatBox/ChatBox";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";

//style
import "../styles/Dashboard.scss";

class Dashboard extends Component {
  constructor() {
    super();
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
      let projectId;
      let subMatch = "board";
      if (globalMatch) {
        projectId = globalMatch.params.id;

        subMatch = globalMatch.path.split("/");
        subMatch = subMatch[subMatch.length - 1];
      }

      header = <Header />;

      projectList = projects.map((project, index) => {
        return (
          <li key={index}>
            <Link
              to={`/project/${project._id}/${subMatch}`}
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
        <div className="loader">
          <Loader />
        </div>
      );

      header = (
        <div className="loader">
          <Loader />
        </div>
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
              <Route exact path="/project" component={MainSection} />
              <Route exact path="/project/:id/board" component={Board} />
              <Route exact path="/project/:id/chatbox" component={ChatBox} />
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

// const mapDispatchToProps = (dispatch) => ({
//   resetProject: () => dispatch(setProject(null)),
// });

export default connect(mapStateToProps, null)(Dashboard);
