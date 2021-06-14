import React, { useState } from "react";
import AddTask from "./forms/addTask";

import ConfirmDialog from './common/ConfirmDialog';
import { NotifyProjectChange } from "./Socket";

//style
import "../styles/Tooltip.scss";

const Tooltip = ({ id, title, addCard, removeLane }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleShowConfirmDelete = () => setShowConfirmDelete(true);
    const handleCloseConfirmDelete = () => setShowConfirmDelete(false);

    return (
      <span>
        <i
          className="fas fa-times-circle icon-remove"
          onClick={handleShowConfirmDelete}
        ></i>

        <AddTask
          laneId={id}
          laneTitle={title}
          addCard={addCard}
        />

        <ConfirmDialog
          open={showConfirmDelete}
          title={"Confirm Delete Lane"}
          description={`This will also delete all the Task inside. Are you sure want to Delete Lane: ${title} ?`}
          handleClose={handleCloseConfirmDelete}
          handleConfirm={removeLane}
        />
      </span>
    );
}
export default Tooltip;
