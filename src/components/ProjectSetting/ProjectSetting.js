import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Loader from "../Loader";
import MemberItem from "./MemberItem";

import SaveIcon from "@material-ui/icons/Save";
import WarningIcon from "@material-ui/icons/Warning";

import ConfirmDialog from "../common/ConfirmDialog";

// action
import { setGlobalMatch } from "../../actions/index";
import { NotifyProjectChange } from "../Socket";

const MyContainer = styled.div`
  padding: 10px 20px;
`;

const useStyles = makeStyles((theme) => ({
  propertyInputField: {
    width: 240,
    marginTop: "5px",
  },
  categoryTitle: {
    marginTop: "10px",
  },
}));

const ProjectSetting = ({ match }) => {
  const history = useHistory();
  const classes = useStyles();

  const [roles, setRoles] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [removeUserId, setRemoveUserId] = useState("");
  const [unbanUserId, setUnbanUserId] = useState("");
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false);
  const [showConfirmUnbanDialog, setShowConfirmUnbanDialog] = useState(false);
  const [showConfirmDeleteProject, setShowConfirmDeleteProject] =
    useState(false);

  const project = useSelector((state) => state.project);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalMatch(match));

    if (project && project.id !== match.params.id) {
      history.replace(`/project/${match.params.id}`);
    }
  }, [project, match.params.id]);

  useEffect(() => {
    if (project) {
      setRoles(project.roles);
      setProjectName(project.name);
    }
  }, [project]);

  useEffect(() => {
    if (project && !removedMembers.length) {
      getRemovedMembers(project.id);
    }
  }, [project]);

  useEffect(() => {
    if (searchKeyword === "") {
      setFilteredMembers(project.members);
    } else {
      const filter = project.members.filter(
        (member) =>
          member.email.includes(searchKeyword) ||
          member.username.includes(searchKeyword)
      );
      setFilteredMembers(filter);
    }
  }, [searchKeyword]);

  const handleLevelChange = (id, level) => {
    if (!level.trim()) return;

    const newRoles = roles;
    newRoles.forEach((role) => {
      if (role.id === id) {
        role.level = +level;
        if (role.level < 0) role.level = 0;
        if (role.level > 999) role.level = 999;
      }
    });
    setRoles([...newRoles]);
  };

  const handleProjectNameChange = (value) => {
    setProjectName(value);
  };

  const handleConfirmDeleteIdChange = (value) => {
    setConfirmDeleteProjectId(value);
  };

  const handleSaveSetting = async () => {
    await axios.patch(`http://localhost:2104/project/setting/${project.id}`, {
      projectName,
      roles,
    });

    NotifyProjectChange();
  };

  const handleOpenConfirmRemove = (roleId) => {
    setRemoveUserId(roleId);
    setShowConfirmRemoveDialog(true);
  };

  const handleCloseConfirmRemove = () => {
    setShowConfirmRemoveDialog(false);
  };

  const handleOpenConfirmUnban = (userId) => {
    setUnbanUserId(userId);
    setShowConfirmUnbanDialog(true);
  };

  const handleCloseConfirmUnban = () => {
    setShowConfirmUnbanDialog(false);
  };

  const getRemovedMembers = async (projectId) => {
    const req = await axios.get(`http://localhost:2104/project/setting/${projectId}/getRemovedMembers`);
    setRemovedMembers(req.data);
  }

  const requestRemoveUserFromProject = async () => {
    await axios.delete(`http://localhost:2104/role/${removeUserId}`, {
      data: {
        projectId: project.id,
      },
    });
    NotifyProjectChange();
    history.go(0);
  };

  const requestUnbanUserFromProject = async () => {
    await axios.post(`http://localhost:2104/role/${unbanUserId}/unban`, {
      projectId: project.id,
    });
    NotifyProjectChange();
    history.go(0);
  };

  const handleOpenConfirmDeleteProject = () =>
    setShowConfirmDeleteProject(true);
  const handleCloseConfirmDeleteProject = () =>
    setShowConfirmDeleteProject(false);

  const handleDeleteProject = async () => {
    if (confirmDeleteProjectId === project.id) {
      await axios.delete(`http://localhost:2104/project/${project.id}`);

      handleCloseConfirmDeleteProject();
      history.replace("/project");
    } else {
      alert("WRONG PROJECT ID");
    }
  };

  const handleSearchKeywordChange = (value) => {
    setSearchKeyword(value);
  };

  return project ? (
    <MyContainer>
      <Typography className={classes.categoryTitle} variant="h4">
        Project Property
      </Typography>
      <TextField
        className={classes.propertyInputField}
        label="Project ID"
        defaultValue={project.id}
        width={200}
        disabled
      />
      <br />
      <TextField
        className={classes.propertyInputField}
        label="Project Name"
        defaultValue={project.name}
        required
        onChange={(e) => handleProjectNameChange(e.target.value)}
      />
      <Typography className={classes.categoryTitle} variant="h4">
        Members:
      </Typography>
      <TextField
        autoFocus
        style={{ width: 640 }}
        margin="dense"
        label="Search by Username or Email:"
        defaultValue={searchKeyword}
        onChange={(e) => handleSearchKeywordChange(e.target.value)}
      />
      <List style={{ width: 640, maxHeight: 700, overflow: "auto" }}>
        {filteredMembers.map((member, index) => (
          <MemberItem
            key={index}
            member={member}
            roles={project.roles}
            handleLevelChange={handleLevelChange}
            handleRemoveBtnClick={handleOpenConfirmRemove}
          />
        ))}
      </List>

      <Typography className={classes.categoryTitle} variant="h4">
        Banned Members:
      </Typography>
      <List style={{ width: 640, maxHeight: 700, overflow: "auto" }}>
        {removedMembers.map((member, index) => (
          <MemberItem
            key={index}
            member={member}
            handleUnbanBtnClick={handleOpenConfirmUnban}
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

      <Typography style={{ marginTop: 30 }} variant="h3" color="secondary">
        Danger Area
      </Typography>
      <Button
        onClick={handleOpenConfirmDeleteProject}
        variant="contained"
        color="secondary"
        startIcon={<WarningIcon />}
        style={{
          width: 200,
        }}
      >
        Delete Project
      </Button>

      <ConfirmDialog
        open={showConfirmRemoveDialog}
        title={"Remove User from Project"}
        description={
          "This user will be remove from this Project and can't be added or join again. Are you sure want to Remove this user?"
        }
        handleClose={handleCloseConfirmRemove}
        handleConfirm={requestRemoveUserFromProject}
      />

      <ConfirmDialog
        open={showConfirmUnbanDialog}
        title={"Unban User"}
        description={
          "Are you sure want to Unban this user?"
        }
        handleClose={handleCloseConfirmUnban}
        handleConfirm={requestUnbanUserFromProject}
      />

      <Dialog
        open={showConfirmDeleteProject}
        onClose={handleCloseConfirmDeleteProject}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you really sure that you want to DELETE this Project? Please
            Enter Project ID to Confirm!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project ID"
            fullWidth
            defaultValue={confirmDeleteProjectId}
            onChange={(e) => handleConfirmDeleteIdChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteProject} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProject} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MyContainer>
  ) : (
    <Loader />
  );
};

export default ProjectSetting;
