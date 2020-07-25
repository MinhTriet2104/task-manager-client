import React from "react";
import PlusIcon from "mdi-react/PlusIcon";

//style
import "../styles/CustomAddLink.scss";

export default () => (
  <button
    className="btn-add"
    style={{
      width: "240px",
      marginRight: "10px",
      background: "#f7f7f9",
      boxShadow: "0px 3px 5px #bababa7d",
    }}
  >
    <span>
      <PlusIcon className="icon-plus" />
    </span>{" "}
    Add a Lane
  </button>
);
