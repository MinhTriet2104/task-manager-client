import React, { useState } from "react";
import PlusIcon from "mdi-react/PlusIcon";

import AddLane from "./forms/AddLane";

//style
import "../styles/CustomAddLink.scss";

export default () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className="btn-add"
        style={{
          width: "240px",
          marginRight: "10px",
          background: "#f7f7f9",
          boxShadow: "0px 3px 5px #bababa7d",
        }}
        onClick={handleClickOpen}
      >
        <span>
          <PlusIcon className="icon-plus" />
        </span>{" "}
        Add a Lane
      </button>
      <AddLane open={open} handleClose={handleClose} />
    </>
  );
};
