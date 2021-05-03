import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import TaskDetail from "./forms/taskDetail";

import { green } from "@material-ui/core/colors";
import Chip from '@material-ui/core/Chip';

// icon
import DeleteIcon from "mdi-react/DeleteOutlineIcon";
// import SortVariant from "mdi-react/SortVariantIcon";
import MuiAvatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import CheckIcon from '@material-ui/icons/Check';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccessAlarmsRoundedIcon from '@material-ui/icons/AccessAlarmsRounded';
// import TocIcon from '@material-ui/icons/Toc';


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
    color: '#fff',

    margin: '4px 0',
    boxShadow: '0 2px 6px rgb(76 175 80 / 50%)',

    '& svg': {
      color: '#fff',
    }
  },
  expiredChip: {
    background: '#ff002a',
    color: '#fff',

    margin: '4px 0',
    boxShadow: '0 2px 6px #ff002a57',

    '& svg': {
      color: '#fff',
    }
  }
}));

const CustomCard = ({
  _id,
  name,
  description,
  dueDate,
  assignees,
  complete,
  onDelete,
  onClick,
}) => {
  const classes = useStyles();

  let cardDescription = "";
  if (description) {
    cardDescription =
      description.length > 32 ? description.slice(0, 32) + "..." : description;
  } else {
    cardDescription = "This task don't have description";
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkIsExpired = () => {
    const taskDueDate = moment(dueDate);
    const curDate = moment();

    const diffDate = curDate.diff(taskDueDate, 'days');

    if (diffDate > 0) {
      return true;
    }
    return false;
  }

  return (
    <div>
      <div id={_id} className="mcell-task" onClick={handleClickOpen}>
        {complete && <Chip
          size="small"
          icon={<CheckIcon />}
          label="complete"
          className={classes.completeChip}
        /> || checkIsExpired() && <Chip
        size="small"
        icon={<AccessTimeIcon />}
        label="expired"
        className={classes.expiredChip} />}
        <span className="task-name">
          <span>{name}</span>
          <i className="icon-delete">
            <DeleteIcon id="delete" onClick={onDelete}></DeleteIcon>
          </i>
        </span>
        <span className="task-details">{cardDescription}</span>
        <div>
          <span className="task-due">
            <AccessAlarmsRoundedIcon />
            {moment(dueDate).format("DD/MM/YYYY hh:mm")}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            <i className="far fa-comment icon-coment"></i>
            <div className="number-comment">1</div>
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
        taskId={_id}
        handleClose={handleClose}
        assignees={assignees}
        description={description}
        dueDate={dueDate}
        name={name}
        complete={complete}
      />
    </div>
  );
};

export default CustomCard;
