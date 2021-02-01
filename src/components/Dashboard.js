import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Route, Switch, Redirect } from "react-router-dom";
import Link from "./common/CustomLink";
import classNames from "classnames";

// components
import MainSection from "./MainSection";
import Board from "./Board";
import Table from "./Table/Table";
// import ChatBox from "./ChatBox/ChatBox";
import AddStory from "./forms/addStory";
import Loader from "./Loader";
import Header from "./common/Header";

//style
import "../styles/Dashboard.scss";

import usePushNotifications from "../hooks/usePushNotifications";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const globalMatch = useSelector((state) => state.globalMatch);

  const {
    userConsent,
    pushNotificationSupported,
    userSubscription,
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
  } = usePushNotifications();

  useEffect(() => {
    getProjects();
    onClickAskUserPermission();
    // onClickSusbribeToPushNotification();
  }, []);

  const getProjects = () => {
    setLoading(true);

    axios
      .get(`http://localhost:2104/project`)
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
        <Link to={`/project`} className="logo">
          Task Manager
        </Link>
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
              render={() => <MainSection getProjects={getProjects} />}
            />

            <Route exact path="/project/:id/board" component={Board} />
            <Route exact path="/project/:id/table" component={Table} />
            {/* <Route exact path="/project/:id/chatbox" component={ChatBox} /> */}

            <Route
              exact
              path="/project/:id"
              render={(props) => (
                <Redirect to={`${props.match.params.id}/board`} />
              )}
            />
          </Switch>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
