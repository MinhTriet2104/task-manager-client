import React from "react";
import PlusIcon from "mdi-react/PlusIcon";

//style
import "../styles/CustomFooter.scss";


export default () => (
  <button className="btn-add">
    <span>
      <PlusIcon className="icon-plus" />
    </span>{" "}
    Add a Card
  </button>
);
