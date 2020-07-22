import React from "react";
import Tooltip from "./Tooltip";
//style
import "../styles/CustomHeader.scss";

export default ({ id, title }) => (
  <div className="mcell-title">
    {title}
    <Tooltip
      id={id}
      content="You can do what you want to do with this column"
      placement="top"
    />
  </div>
);
