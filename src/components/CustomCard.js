import React from "react";
import moment from "moment";

const CustomCard = ({
  _id,
  name,
  description,
  dueDate,
  assignee,
  onDelete,
}) => {
  return (
    <div id={_id} className="mcell-task">
      <span className="task-name">
        {/* <div className={"colorGreen"} id="icon-title" /> */}
        <span>{name}</span>
        <i
          id="delete"
          className="far fa-trash-alt icon-delete"
          onClick={onDelete}
        ></i>
      </span>
      <span className="task-details">
        {description ? description : "This task don't have description"}
      </span>
      <div>
        <span className="task-due">{moment(dueDate).format("DD/MM/YYYY")}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="40pt"
        height="40pt"
        className="icon-dificult"
      >
        <rect
          x="0"
          y="1"
          width="40"
          height="4"
          transform="matrix(1,0,0,1,0,0)"
          fill="rgb(0,0,0)"
        />
        <rect
          x="0"
          y="9"
          width="35"
          height="4"
          transform="matrix(1,0,0,1,0,0)"
          fill="rgb(0,0,0)"
        />
        <rect
          x="0"
          y="17"
          width="30"
          height="4"
          transform="matrix(1,0,0,1,0,0)"
          fill="rgb(0,0,0)"
        />
        <rect
          x="0"
          y="25"
          width="25"
          height="4"
          transform="matrix(1,0,0,1,0,0)"
          fill="rgb(0,0,0)"
        />
        <rect
          x="0"
          y="33"
          width="21"
          height="4"
          transform="matrix(1,0,0,1,0,0)"
          fill="rgb(0,0,0)"
        />
      </svg>
      <span>
        <div className="number-dificult"> 1</div>
        <i className="far fa-comment icon-coment"></i>
        <div className="number-comment"> 1</div>
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
