import React from "react";
import Tooltip from "./Tooltip";

export default ({ id, title, actions }) => {
  // console.log(actions.addCard);
  return (
    <div className="mcell-title">
      {title}
      <Tooltip
        id={id}
        title={title}
        addCard={actions.addCard}
        content="You can do what you want to do with this column"
        placement="top"
      />
    </div>
  );
};
