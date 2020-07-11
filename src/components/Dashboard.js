import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Board from "react-trello";
// import Project from "./Project";
import CustomCard from "./CustomCard";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";

import { getProject, setLoadingProject } from "../actions/index";

const handleDragStart = (cardId, laneId) => {
  console.log("drag started");
  console.log(`cardId: ${cardId}`);
  console.log(`laneId: ${laneId}`);
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log("drag ended");
  console.log(`cardId: ${cardId}`);
  console.log(`sourceLaneId: ${sourceLaneId}`);
  console.log(`targetLaneId: ${targetLaneId}`);
};

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      projects: [],
      project: this.props.project,
      err: "",
    };

    this.getProjects = this.getProjects.bind(this);
  }

  componentDidMount = () => {
    // this.getStoryDetails();
    this.getProjects();
    this.props.getProject(this.props.match.params.id);
    // setInterval(() => {
    //   this.getData();
    // }, 2000);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.project !== prevState.project) {
      return { project: nextProps.project };
    }
    return null;
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.getProject(this.props.match.params.id);
    }
    if (this.props.project !== prevProps.project) {
      this.setState({
        project: this.props.project,
      });
    }
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
      .catch((e) => {
        this.props.setLoadingProject(true);
      });
  };

  render() {
    const { projects } = this.state;
    const { match, project, loadingProject } = this.props;
    let projectList, boardRender;

    if (!loadingProject) {
      const projectId = match.params.id;
      const { tasks } = project;

      tasks.map((task) => (task.id = task._id));

      const data = {
        lanes: [
          {
            id: "lane-1",
            title: "Pending",
            style: {
              width: 280,
            },
            cards: tasks.filter((task) => task.status === 1),
          },
          {
            id: "lane-2",
            title: "TODO",
            style: {
              width: 280,
            },
            cards: tasks.filter((task) => task.status === 2),
          },
          {
            id: "lane-3",
            title: "IN PROGRESS",
            style: {
              width: 280,
            },
            cards: tasks.filter((task) => task.status === 3),
          },
          {
            id: "lane-4",
            title: "Done",
            style: {
              width: 280,
            },
            cards: tasks.filter((task) => task.status === 4),
          },
        ],
      };

      projectList = projects.map((project, index) => {
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

      boardRender = (
        <Board
          data={data}
          draggable
          // laneDraggable={false}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          components={{ Card: CustomCard }}
        />
      );
    } else {
      projectList = (
        <li>
          <div className="loader">
            <Loader />
          </div>
        </li>
      );

      boardRender = (
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
          <ul className="side-menu">{projectList}</ul>
          <div className="otherMenu">
            <AddStory />
          </div>
        </div>
        <div className="con">
          <Header />
          <aside>{boardRender}</aside>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingProject: state.loading.loadingProject,
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setLoadingProject: (status) => dispatch(setLoadingProject(status)),
  getProject: (id) => dispatch(getProject(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
