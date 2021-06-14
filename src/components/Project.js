import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import Header from "./common/Header";
import Board from "./Board";
import Table from "./Table/Table";
import Chart from "./Chart";
import Notification from "./Notfication/Notification";
import History from "./History/History";
import ProjectSetting from "./ProjectSetting/ProjectSetting";

import Loader from "./Loader";

import usePushNotifications from "../hooks/usePushNotifications";
import {
  initiateSocket,
  disconnectSocket,
  subscribeToReloadProject,
  NotifyProjectChange,
} from "./Socket";

// action
import { getProject } from "../actions/index";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Project = ({ match }) => {
  const { userConsent, pushNotificationSupported, onClickAskUserPermission } =
    usePushNotifications();

  const project = useSelector((state) => state.project);
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [isUserinBlackList, setIsUserinBlackList] = useState(true);
  const [showSettingPage, setShowSettingPage] = useState(false);

  const dispatch = useDispatch();

  const prevMatch = usePrevious(match);

  useEffect(() => {
    if (prevMatch && prevMatch.params.id === match.params.id) return;

    dispatch(getProject(match.params.id));

    if (match.params.id) initiateSocket(match.params.id);

    subscribeToReloadProject(() => dispatch(getProject(match.params.id)));

    return () => {
      disconnectSocket();
    };
  }, [match.params.id]);

  useEffect(() => {
    // dispatch(setGlobalMatch(match));
    dispatch(getProject(match.params.id));
  }, []);

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (project && user) {
      setLoading(true);
      if (project.removedMembers.includes(user.id)) {
        setIsUserinBlackList(true);
      } else {
        setIsUserinBlackList(false);
        if ((project.owner && project.owner.id === user.id) || user.idAdmin) {
          setShowSettingPage(true);
        }
      }
      setLoading(false);
    }
  }, [project, user]);

  useEffect(() => {
    if (project && user && !isUserinBlackList) {
      setLoading(true);
      const findedMember = project.members.find(
        (member) => member.id === user.id
      );
      const findedRole = project.roles.find((role) => role.user === user.id);

      let completeRequest = 0;
      let requestAmount = 0;

      if (!findedMember) requestAmount++;
      if (!findedRole) requestAmount++;

      if (!findedMember) {
        axios
          .post(`http://localhost:2104/project/${project.id}/addmember`, {
            userId: user.id,
          })
          .then((res) => {
            if (res.status === 200) {
              completeRequest++;
              if (completeRequest === requestAmount) {
                NotifyProjectChange();
                setLoading(false);
              }
            }
          });
      }

      if (!findedRole) {
        axios
          .post(`http://localhost:2104/project/${project.id}/addrole`, {
            userId: user.id,
          })
          .then((res) => {
            if (res.status === 200) {
              completeRequest++;
              if (completeRequest === requestAmount) {
                NotifyProjectChange();
                setLoading(false);
              }
            }
          });
      }
    }
  }, [isUserinBlackList]);

  if (!localStorage.getItem("user")) return <Redirect to="/login" />;

  return loading ? (
    <Loader />
  ) : isUserinBlackList ? (
    <h2>Access Denied</h2>
  ) : (
    <>
      <Header showSettingPage={showSettingPage} />
      <Switch>
        <Route exact path="/project/:id/board" component={Board} />
        <Route exact path="/project/:id/table" component={Table} />
        <Route exact path="/project/:id/chart" component={Chart} />
        <Route
          exact
          path="/project/:id/notification"
          component={Notification}
        />
        <Route exact path="/project/:id/history" component={History} />
        
        {showSettingPage && (
          <Route exact path="/project/:id/setting" component={ProjectSetting} />
        )}
        {/* <Route exact path="/project/:id/chatbox" component={ChatBox} /> */}

        <Route
          exact
          path="/project/:id"
          render={(props) => <Redirect to={`${props.match.params.id}/board`} />}
        />

        <Route render={() => <Redirect to={`/`} />} />
      </Switch>
    </>
  );
};

export default Project;
