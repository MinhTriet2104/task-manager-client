import React from "react";
import Tooltip from "./Tooltip";

export default ({ id, title, addCard }) => {
  // console.log(props);
  return (
    <div className="mcell-title">
      {title}
      <Tooltip
        id={id}
        title={title}
        content="You can do what you want to do with this column"
        placement="top"
      />
    </div>
  );
};
