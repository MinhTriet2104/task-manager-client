import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import axios from "axios";
import { Route, Switch, Redirect } from "react-router-dom";
import Link from "./common/CustomLink";
import classNames from "classnames";

import { blue, red } from "@material-ui/core/colors";

// components
import MainSection from "./MainSection";
import Project from "./Project";
// import ChatBox from "./ChatBox/ChatBox";
import AddStory from "./forms/addStory";
import Loader from "./Loader";

import Badge from "@material-ui/core/Badge";

import AssignmentIcon from "@material-ui/icons/Assignment";

//style
import "../styles/Dashboard.scss";

import { setUser, setNotifications } from "../actions";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#ff002a",
    },
  },
});

const Dashboard = () => {
  const dispatch = useDispatch();

  const [projects, setProjects] = useState([]);
  const [unreadNotfication, setUnreadNotfication] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const globalMatch = useSelector((state) => state.globalMatch);
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);

  useEffect(() => {
    getProjects();
    // onClickAskUserPermission();
    // onClickSusbribeToPushNotification();
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:2104/user/${user.id}`)
        .then((res) => dispatch(setUser(res.data)));
    }
  }, []);

  useEffect(() => {
    if (user && user.notifications && projects) {
      const curDate = moment();

      let projectNotfication = {};
      projects.forEach((project) => {
        let filteredNotification = [];
        if (user.notifications[project.id]) {
          filteredNotification = user.notifications[project.id].filter(
            (noti) => {
              if (!noti.seen) {
                const taskDueDate = moment(noti.dueDate);

                if (noti.type === "add") return true;
                else if (noti.type === "expire 1d") {
                  const diffDays = taskDueDate.diff(curDate, "days");

                  if (diffDays <= 1) return true;
                } else if (noti.type === "expire 1h") {
                  const diffHours = taskDueDate.diff(curDate, "hours");

                  if (diffHours <= 1) return true;
                }
                return false;
              } else {
                return false;
              }
            }
          );
        }

        projectNotfication[project.id] = filteredNotification;
      });

      setUnreadNotfication(projectNotfication);
      dispatch(setNotifications(projectNotfication));
    }
  }, [user, projects]);

  const getProjects = () => {
    setLoading(true);

    // axios
    //   .get(`http://localhost:2104/project`)
    //   .then((r) => {
    //     console.log("getProjects", r.data);
    //     setProjects(r.data);
    //     setLoading(false);
    //     setErr("");
    //   })
    //   .catch((e) => {
    //     setLoading(false);
    //     setErr(e);
    //   });

    user &&
      axios
        .get(`http://localhost:2104/project/user/${user.id}`)
        .then((r) => {
          console.log("getProjects", r.data);
          setProjects(r.data);
          setLoading(false);
          setErr("");
        })
        .catch((e) => {
          setLoading(false);
          setErr(e);
        });
  };

  let projectList;

  if (!loading) {
    let projectId;
    let subMatch = "board";
    if (globalMatch) {
      projectId = globalMatch.params.id;

      subMatch = globalMatch.path.split("/");
      subMatch = subMatch[subMatch.length - 1];
    }

    projectList = projects.map((project, index) => {
      return (
        <li key={index}>
          <Link
            to={`/project/${project.id}/board`}
            className={classNames({
              active: project.id === projectId,
            })}
          >
            {unreadNotfication[project.id] ? (
              <>
                <StyledBadge
                  badgeContent={unreadNotfication[project.id].length}
                  max={99}
                  children={<AssignmentIcon />}
                  color="secondary"
                />
                <span className="menu-text" style={{ paddingLeft: 20 }}>
                  {project.name}
                </span>
              </>
            ) : (
              <>
                <AssignmentIcon />
                <span className="menu-text">{project.name}</span>
              </>
            )}
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
  }

  if (!localStorage.getItem("user")) return <Redirect to="/login" />;

  return (
    <ThemeProvider theme={mainTheme}>
      <div style={{ position: "relative" }}>
        <div className="side">
          <Link to={`/project`} className="logo">
            Task Manager
          </Link>
          <ul className="side-menu">{projectList}</ul>
          {/* <div className="otherMenu">
          <AddStory />
        </div> */}
        </div>
        <div className="con">
          <aside style={{ height: "100vh", overflow: "auto" }}>
            <Switch>
              <Route
                exact
                path="/project"
                render={() => <MainSection getProjects={getProjects} />}
              />

              <Route path="/project/:id" component={Project} />
            </Switch>
          </aside>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
