import React from "react";
import PlusIcon from "mdi-react/PlusIcon";

//style
import "../styles/CustomAddLink.scss";

export default () => (
  <button className="btn-add" style={{ width: "240px", marginRight: "10px" }}>
    <span>
      <PlusIcon className="icon-plus" />
    </span>{" "}
    Add a Lane
  </button>
);
