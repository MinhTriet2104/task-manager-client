import React from "react";
import PlusIcon from "mdi-react/PlusIcon";

//style
import "../styles/CustomAddLink.scss";

export default ({ onClick }) => (
  <button
    className="btn-add"
    style={{
      width: "240px",
      marginRight: "10px",
      background: "#f9f9fe",
      boxShadow: "0px 3px 5px #bababa7d",
    }}
    onClick={onClick}
  >
    <span>
      <PlusIcon className="icon-plus" />
    </span>{" "}
    Add New Lane
  </button>
);
