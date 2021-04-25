import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";

import Header from "./common/Header";
import Board from "./Board";
import Table from "./Table/Table";
import ProjectSetting from "./ProjectSetting/ProjectSetting";

import { initiateSocket, disconnectSocket, subscribeToReloadProject } from './Socket';

// action
import {
  getProject,
} from "../actions/index";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Project = ({ match }) => {
  const project = useSelector((state) => state.project);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const prevMatch = usePrevious(match);

  useEffect(() => {
    if (prevMatch && prevMatch.params.id === match.params.id) return;

    dispatch(getProject(match.params.id));

    if (match.params.id) initiateSocket(match.params.id);

    subscribeToReloadProject(() => dispatch(getProject(match.params.id)));

    return () => {
      disconnectSocket();
    }
    
  }, [match.params.id]);

  useEffect(() => {
    // dispatch(setGlobalMatch(match));

    // if (project && project.id === match.params.id) return;
    dispatch(getProject(match.params.id));
  }, []);

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);

  return (
    <>
    <Header />
    <Switch>
      <Route exact path="/project/:id/board" component={Board} />
      <Route exact path="/project/:id/table" component={Table} />
      <Route
        exact
        path="/project/:id/setting"
        component={ProjectSetting}
      />
      {/* <Route exact path="/project/:id/chatbox" component={ChatBox} /> */}

      <Route
        exact
        path="/project/:id"
        render={(props) => (
          <Redirect to={`${props.match.params.id}/board`} />
        )}
      />

      <Route
        render={() => <Redirect to={`home`} />}
      />
    </Switch>
    </>
  )
}

export default Project
