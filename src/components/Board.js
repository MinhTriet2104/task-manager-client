import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Board from "react-trello";
import CustomCard from "./CustomCard";
import CustomFooter from "./CustomFooter";
import CustomHeader from "./CustomHeader";
import CustomAddLaneSection from "./CustomAddLaneSection";
import Loader from "./Loader";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconDetailTitle from "mdi-react/CardBulletedOutlineIcon";

//import style
import "../styles/Board.scss";

// action
import {
  getProject,
  deleteTaskRequest,
  updateStatusTaskRequest,
} from "../actions/index";

export default ({ match }) => {
  const [data, setData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cardId, setCardId] = useState("");
  const [sourceLaneId, setSourceLaneId] = useState("");
  const [targetLaneId, setTargetLaneId] = useState("");
  const [loading, setLoading] = useState(true);
  //set open function for Modal
  const [open, setOpen] = useState(false);

  const project = useSelector((state) => state.project);
  // const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    setData(null);
    setLoading(true);
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project && !data) {
      const lanes = [];
      project.lanes.forEach((lane) => {
        lanes.push({
          ...lane,
          title: lane.name,
          // style: {
          //   width: 280,
          //   maxHeight: "85vh",
          // },
          cards: lane.tasks,
        });
      });
      setData({
        lanes: lanes,
      });
      setLoading(false);
    }
  }, [project]);

  // useEffect(() => {
  //   if (isUpdate) {
  //     console.log(data);
  //     const lane = data.lanes.find((lane) => lane.id === targetLaneId);
  //     lane.tasks = lane.cards;
  //     dispatch(
  //       updateStatusTaskRequest(cardId, lane, sourceLaneId, targetLaneId)
  //     );
  //     isUpdate = false;
  //   }
  // }, [data]);

  const onCardDelete = (cardId, laneId) => {
    dispatch(deleteTaskRequest(cardId, laneId));
  };

  const handleDragStart = (cardId, laneId) => {
    // console.log("drag started");
    // console.log(`cardId: ${cardId}`);
    // console.log(`laneId: ${laneId}`);
  };

  const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    setCardId(cardId);
    setSourceLaneId(sourceLaneId);
    setTargetLaneId(targetLaneId);
    setIsUpdate(true);
    // dispatch(updateStatusTaskRequest(cardId, sourceLaneId, targetLaneId));
  };

  const onDataChange = (newData) => {
    if (isUpdate) {
      console.log(newData);
      const lane = newData.lanes.find((lane) => lane.id === targetLaneId);
      lane.tasks = lane.cards;
      dispatch(
        updateStatusTaskRequest(cardId, lane, sourceLaneId, targetLaneId)
      );
      setIsUpdate(false);
    }
  };

  const onCardClick = (cardId, metadata, laneId) => {
    console.log("Task Clicked:", cardId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return loading ? (
    <li>
      <div className="loader">
        <Loader />
      </div>
    </li>
  ) : (
    <div>
      <Board
        data={data}
        style={{
          backgroundColor: "transparent",
          height: "calc(100vh - 58px)",
        }}
        // collapsibleLanes
        draggable
        canAddLanes
        editable
        onCardDelete={onCardDelete}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        onDataChange={onDataChange}
        onCardClick={onCardClick}
        components={{
          LaneHeader: CustomHeader,
          Card: CustomCard,
          AddCardLink: CustomFooter,
          NewLaneSection: CustomAddLaneSection,
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="modal-comment"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="modal-content">
            <h2 id="transition-modal-title">
              <span>
                <IconDetailTitle className="icon-task"></IconDetailTitle>
              </span>
              Task Detail
            </h2>
            <table className="card-detail">
              <tr>
                <th>Members</th>
                <th>Lables</th>
                <th>Due Date</th>
              </tr>
              <tr>
                <th>
                  <span className="img-member">XV</span>
                </th>
                <th>test 2</th>
                <th>test 2</th>
              </tr>
            </table>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
