import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import TaskDetail from "./forms/taskDetail";

import { green } from "@material-ui/core/colors";
import Chip from "@material-ui/core/Chip";

// icon
import DeleteIcon from "mdi-react/DeleteOutlineIcon";
// import SortVariant from "mdi-react/SortVariantIcon";
import MuiAvatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import CheckIcon from "@material-ui/icons/Check";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AccessAlarmsRoundedIcon from "@material-ui/icons/AccessAlarmsRounded";
import PlaylistAddCheckSharpIcon from "@material-ui/icons/PlaylistAddCheckSharp";
// import TocIcon from '@material-ui/icons/Toc';

import ConfirmDialog from "./common/ConfirmDialog";

//style
import "../styles/CustomCard.scss";

const Avatar = withStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
  },
}))(MuiAvatar);

const useStyles = makeStyles((theme) => ({
  completeChip: {
    background: green[500],
    color: "#fff",

    margin: "4px 0",
    boxShadow: "0 2px 6px rgb(76 175 80 / 50%)",

    "& svg": {
      color: "#fff",
    },
  },
  expiredChip: {
    background: "#ff002a",
    color: "#fff",

    margin: "4px 0",
    boxShadow: "0 2px 6px #ff002a57",

    "& svg": {
      color: "#fff",
    },
  },
}));

const CustomCard = ({
  _id,
  creator,
  deliveryDate,
  name,
  description,
  dueDate,
  assignees,
  list,
  complete,
  onDelete,
}) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);
  const project = useSelector((state) => state.project);

  let cardDescription = "";
  if (description) {
    cardDescription =
      description.length > 32 ? description.slice(0, 32) + "..." : description;
  } else {
    cardDescription = "This task don't have description";
  }
  const [open, setOpen] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [taskCreatorLevel, setTaskCreatorLevel] = useState(0);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (project && project.members) {
      project.members.forEach((member) => {
        if (member && user && creator) {
          if (member.id == user.id) {
            setUserLevel(member.level);
          }
          if (member.id == creator.id) {
            setTaskCreatorLevel(member.level);
          }
        }
      });
    }
  }, [project]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkIsExpired = () => {
    const taskDueDate = moment(dueDate);
    const curDate = moment();

    const diffDate = curDate.diff(taskDueDate, "days");

    if (diffDate > 0) {
      return true;
    }
    return false;
  };

  const completeTask = list.filter((item) => item.complete);

  const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

  return (
    <div>
      <div id={_id} className="mcell-task">
        {(complete && (
          <Chip
            size="small"
            icon={<CheckIcon />}
            label="complete"
            className={classes.completeChip}
          />
        )) ||
          (checkIsExpired() && (
            <Chip
              size="small"
              icon={<AccessTimeIcon />}
              label="expired"
              className={classes.expiredChip}
            />
          ))}
        <span className="task-name">
          <span style={{ cursor: "pointer" }} onClick={handleClickOpen}>
            {name}
          </span>

          <i className="icon-delete">
            {userLevel >= taskCreatorLevel && (
              <DeleteIcon
                id="delete"
                onClick={() => setShowConfirmDelete(true)}
              ></DeleteIcon>
            )}
          </i>
        </span>
        <span className="task-details">{cardDescription}</span>
        <div>
          <span className="task-due">
            <AccessAlarmsRoundedIcon />
            {moment(dueDate).format("DD/MM/YYYY hh:mm")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#656565",
              padding: 6,
            }}
          >
            <PlaylistAddCheckSharpIcon />
            <div
              style={{ fontSize: 13 }}
            >{`${completeTask.length}/${list.length}`}</div>
          </span>
          <span className="task-contributors">
            <AvatarGroup max={5}>
              {assignees.map((user, index) => (
                <Avatar key={index} alt={user.username} src={user.avatar} />
              ))}
            </AvatarGroup>
          </span>
        </div>
      </div>

      <TaskDetail
        open={open}
        setOpen={setOpen}
        creator={creator}
        deliveryDate={deliveryDate}
        taskId={_id}
        handleClose={handleClose}
        assignees={assignees}
        description={description}
        dueDate={dueDate}
        name={name}
        list={list}
        complete={complete}
      />

      <ConfirmDialog
        open={showConfirmDelete}
        title={"Confirm Delete Task"}
        description={"Are you sure want to Delete this Task?"}
        handleClose={handleCloseConfirmDelete}
        handleConfirm={onDelete}
      />
    </div>
  );
};

export default CustomCard;
