import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import Loader from "../Loader";
import MemberItem from "./MemberItem";

import SaveIcon from "@material-ui/icons/Save";

// action
import { getProject, setGlobalMatch } from "../../actions/index";

const MyContainer = styled.div`
  padding: 5px 10px;
`;

const ProjectSetting = ({ match }) => {
  const [roles, setRoles] = useState([]);

  const project = useSelector((state) => state.project);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalMatch(match));

    // if (project && project.id === match.params.id) return;
    dispatch(getProject(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    if (project) setRoles(project.roles);
  }, [project]);

  const handleLevelChange = (id, level) => {
    if (!level.trim()) return;

    const newRoles = roles;
    newRoles.forEach((role) => {
      if (role.id === id) {
        role.level = +level;
      }
    });
    setRoles([...newRoles]);
  };

  const handleSaveSetting = () => {
    const savedRoles = axios.patch(
      `http://localhost:2104/project/roles/${project.id}`,
      {
        roles,
      }
    );
  };

  return project ? (
    <MyContainer>
      <Typography variant="h4">Project Property</Typography>
      <Typography variant="h4">Members Level</Typography>
      {console.log(project)}
      <List style={{ width: 400 }}>
        {project.members.map((member, index) => (
          <MemberItem
            key={index}
            member={member}
            roles={project.roles}
            handleLevelChange={handleLevelChange}
          />
        ))}
      </List>

      <Button
        onClick={handleSaveSetting}
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </MyContainer>
  ) : (
    <Loader />
  );
};

export default ProjectSetting;
