import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";

import Link from "./common/CustomLink";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import LandingSvg from "../images/landing_svg.svg";

import { logout } from "../actions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  height: calc(100vh - 57px);
  width: 100%;

  padding-top: 30px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;

  line-height: 2.4rem;

  margin-top: 1em;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;

  padding: 1em 0;
`;

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    position: "absolute",
    top: "1rem",
    right: "1rem",
  },
}));

const MainSection = ({ getProjects }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [projectId, setprojectId] = useState("");
  const [projectName, setProjectName] = useState("");

  const user = useSelector((state) => state.user);

  const history = useHistory();

  useEffect(() => {
    getProjects();
  }, []);

  const handleJoinProject = async (keyCode) => {
    if (projectId.trim() === "") return;
    if (keyCode !== 13) return;

    const processedId = projectId.replace(/\s+/g, "").toLowerCase();

    try {
      const res = await axios.post(
        `http://localhost:2104/project/${processedId}`,
        {
          userId: user.id,
        }
      );

      if (res.status === 404) {
        alert("ID_DONT_EXIST");
      } else {
        history.push(`/project/${processedId}`);
      }
    } catch {
      alert("ID_DONT_EXIST");
    }
  };

  const handleCreateProject = async (keyCode) => {
    if (projectName.trim() === "") return;
    if (keyCode !== 13) return;

    try {
      const project = {
        name: projectName,
        owner: user.id,
      };

      const res = await axios.post(`http://localhost:2104/project`, project);

      if (res.status === 201) {
        getProjects();
        history.push(`/project/${res.data.id}`);
      }
    } catch {
      alert("CREATE_FAILED");
    }
  };

  const handleProjectIdChange = (value) => {
    setprojectId(value);
  };

  const handleProjectNameChange = (value) => {
    setProjectName(value);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* <header style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, .10)" }}>
        <div className="mainMenu"></div>
        <div className="profilewidget">
          <i
            style={{ fontSize: 35, color: "#888", cursor: "pointer" }}
            className="fas fa-sign-out-alt"
          ></i>
        </div>
      </header> */}
      <Button
        variant="outlined"
        color="secondary"
        className={classes.button}
        startIcon={<ExitToAppIcon />}
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Container>
        {user.isAdmin && (
          <Link style={{ fontSize: "2rem" }} to={`/admin/users`}>
            Go to Admin Page
          </Link>
        )}
        <Title>Join Project</Title>

        <FormContainer>
          <TextField
            label="Project ID:"
            value={projectId}
            onChange={(e) => handleProjectIdChange(e.target.value)}
            onKeyDown={(e) => handleJoinProject(e.keyCode)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ height: "100%", margin: "0 1em", padding: "0 2em" }}
            onClick={() => handleJoinProject(13)}
          >
            Join
          </Button>
        </FormContainer>

        <Title>Or Create One</Title>

        <FormContainer noValidate autoComplete="off">
          <TextField
            label="Project Name:"
            value={projectName}
            onChange={(e) => handleProjectNameChange(e.target.value)}
            onKeyDown={(e) => handleCreateProject(e.keyCode)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ height: "100%", margin: "0 1em", padding: "0 2em" }}
            onClick={() => handleCreateProject(13)}
          >
            Create
          </Button>
        </FormContainer>

        <img width={800} src={LandingSvg} />
      </Container>
    </>
  );
};

export default MainSection;
