import React from "react";
import moment from "moment";
import TaskDetail from "./forms/taskDetail";
// icon
import DeleteIcon from "mdi-react/DeleteOutlineIcon";
import SortVariant from "mdi-react/SortVariantIcon";

//style
import "../styles/CustomCard.scss";

const CustomCard = ({
  _id,
  name,
  description,
  dueDate,
  assignee,
  onDelete,
  onClick,
}) => {
  console.log(assignee);

  if (description) {
    description =
      description.length > 32 ? description.slice(0, 32) + "..." : description;
  } else {
    description = "This task don't have description";
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
        <span className="task-details">{description}</span>
        <div>
          <span className="task-due">
            {moment(dueDate).format("DD/MM/YYYY")}
          </span>
        </div>
        <span>
          <SortVariant className="icon-dificult" />
          <div className="number-dificult">1</div>
          <i className="far fa-comment icon-coment"></i>
          <div className="number-comment">1</div>
        </span>
        <span className="task-contributors">
          <img
            alt={assignee.username}
            title={assignee.username}
            src={
              assignee.avatar
                ? assignee.avatar
                : "https://i.imgur.com/5bh5qpe.jpg"
            }
          />
        </span>
      </div>

      <TaskDetail
        open={open}
        handleClose={handleClose}
        assignee={assignee}
        dueDate={dueDate}
        name={name}
      />
    </div>
  );
};

export default CustomCard;
