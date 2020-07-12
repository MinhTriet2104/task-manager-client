import React from "react";
import moment from "moment";

// icon
import FireIcon from "mdi-react/FireIcon";
import CloseIcon from "mdi-react/CloseIcon";

const CustomCard = ({
  _id,
  name,
  description,
  dueDate,
  assignee,
  onDelete,
}) => {
  if (description) {
    description =
      description.length > 32 ? description.slice(0, 32) + "..." : description;
  } else {
    description = "This task don't have description";
  }

  return (
    <div id={_id} className="mcell-task">
      <span className="task-name">
        {/* <div className={"colorGreen"} id="icon-title" /> */}
        <span>{name}</span>
        <i className="icon-delete">
          <CloseIcon id="delete" onClick={onDelete}></CloseIcon>
        </i>
      </span>
      <span className="task-details">{description}</span>
      <div>
        <span className="task-due">{moment(dueDate).format("DD/MM/YYYY")}</span>
      </div>
      <span>
        <FireIcon className="icon-dificult" />
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
  );
};

export default CustomCard;
