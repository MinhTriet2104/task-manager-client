import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import TaskDetail from "./forms/taskDetail";

import { green } from "@material-ui/core/colors";
import Chip from "@material-ui/core/Chip";

// icon
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
// import SortVariant from "mdi-react/SortVariantIcon";
import MuiAvatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import CheckIcon from "@material-ui/icons/Check";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AccessAlarmsRoundedIcon from "@material-ui/icons/AccessAlarmsRounded";
import PlaylistAddCheckSharpIcon from "@material-ui/icons/PlaylistAddCheckSharp";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
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
  difficult,
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
  const [userLevel, setUserLevel] = useState(null);
  const [taskCreatorLevel, setTaskCreatorLevel] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (user && project && project.roles) {
      project.roles.forEach((role) => {
        if (role.user && creator) {
          if (role.user === user.id) {
            setUserLevel(role.level);
          }
          if (role.user === creator.id) {
            setTaskCreatorLevel(role.level);
          }
        }
      });
    }
  }, [project, user]);

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

  const renderDifficult = () => {
    let difficultContent = (
      <div style={{ display: 'flex', alignItems: 'center', margin: 3 }}>
        <SentimentVerySatisfiedIcon style={{ color: '#ec8e18' }} />
        <div style={{ fontSize: 12, marginRight: 2 }}>Very Easy</div>
      </div>
    );
    switch (difficult) {
      case 2:
        difficultContent = (
          <div style={{ display: 'flex', alignItems: 'center', margin: 3 }}>
            <SentimentSatisfiedAltIcon style={{ color: '#ec8e18' }} />
            <div style={{ fontSize: 12, marginRight: 2 }}>Easy</div>
          </div>
        );
        break;
      case 3:
        difficultContent = (
          <div style={{ display: 'flex', alignItems: 'center', margin: 3 }}>
            <SentimentSatisfiedIcon style={{ color: '#ec8e18' }} />
            <div style={{ fontSize: 12, marginRight: 2 }}>Medium</div>
          </div>
        );
        break;
      case 4:
        difficultContent = (
          <div style={{ display: 'flex', alignItems: 'center', margin: 3 }}>
            <SentimentDissatisfiedIcon style={{ color: '#ec8e18' }} />
            <div style={{ fontSize: 12, marginRight: 2 }}>Hard</div>
          </div>
        );
        break;
      case 5:
        difficultContent = (
          <div style={{ display: 'flex', alignItems: 'center', margin: 3 }}>
            <SentimentVeryDissatisfiedIcon style={{ color: '#ec8e18' }} />
            <div style={{ fontSize: 12, marginRight: 2 }}>Very Hard</div>
          </div>
        );
        break;
      default:
        break;
    }

    return difficultContent;
  };

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
          <span style={{ color: '#007bff', cursor: "pointer" }} onClick={handleClickOpen}>
            {name}
          </span>

          <i className="icon-delete">
            {userLevel >= taskCreatorLevel && (
              <DeleteForeverIcon
                id="delete"
                color="secondary"
                onClick={() => setShowConfirmDelete(true)}
              />
            )}
          </i>
        </span>

        {renderDifficult()}

        {/* <span className="task-details">{cardDescription}</span> */}

        <div>
          <span className="task-due">
            <AccessAlarmsRoundedIcon color="secondary" />
            {moment(dueDate).format("MMM Do YY, hh:mm a")}
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

      {taskCreatorLevel && userLevel !== null && (
        <TaskDetail
          open={open}
          setOpen={setOpen}
          creator={creator}
          difficult={difficult}
          taskCreatorLevel={taskCreatorLevel}
          userLevel={userLevel}
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
      )}

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
