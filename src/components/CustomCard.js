import React from "react";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import TaskDetail from "./forms/taskDetail";
// icon
import DeleteIcon from "mdi-react/DeleteOutlineIcon";
// import SortVariant from "mdi-react/SortVariantIcon";
import MuiAvatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
// import TocIcon from '@material-ui/icons/Toc';

//style
import "../styles/CustomCard.scss";

const Avatar = withStyles((theme) => ({
  root: {
    width: 32,
    height: 32,
  },
}))(MuiAvatar);

const CustomCard = ({
  _id,
  name,
  description,
  dueDate,
  assignees,
  onDelete,
  onClick,
}) => {
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

  return (
    <div>
      <div id={_id} className="mcell-task" onClick={handleClickOpen}>
        <span className="task-name">
          {/* <div className={"colorGreen"} id="icon-title" /> */}
          <span>{name}</span>
          <i className="icon-delete">
            <DeleteIcon id="delete" onClick={onDelete}></DeleteIcon>
            {/* <CloseIcon id="delete" onClick={onDelete}></CloseIcon> */}
          </i>
        </span>
        <span className="task-details">{cardDescription}</span>
        <div>
          <span className="task-due">
            {moment(dueDate).format("DD/MM/YYYY")}
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
        handleClose={handleClose}
        assignees={assignees}
        description={description}
        dueDate={dueDate}
        name={name}
      />
    </div>
  );
};

export default CustomCard;
