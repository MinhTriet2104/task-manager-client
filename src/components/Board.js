import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Board from "react-trello";
import CustomCard from "./CustomCard";
import CustomFooter from "./CustomFooter";
import CustomHeader from "./CustomHeader";
import CustomAddLaneSection from "./CustomAddLaneSection";
import AddLane from "./forms/AddLane";
import Loader from "./Loader";

//import style
import "../styles/Board.scss";

// action
import {
  getProject,
  deleteTaskRequest,
  updateStatusTaskRequest,
  setGlobalMatch,
} from "../actions/index";

export default ({ match }) => {
  const [data, setData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cardId, setCardId] = useState("");
  const [sourceLaneId, setSourceLaneId] = useState("");
  const [targetLaneId, setTargetLaneId] = useState("");
  const [loading, setLoading] = useState(true);

  const project = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    setData(null);
    setLoading(true);
    dispatch(setGlobalMatch(match));
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project && !data) {
      const lanes = [];
      console.log("Project:", project);
      project.lanes.forEach((lane) => {
        lanes.push({
          ...lane,
          // title: lane.name,
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
        // collapsibleLanes
        draggable
        canAddLanes
        showEditableLane
        editable
        addLaneMode={true}
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
          NewLaneForm: AddLane,
        }}
      />
    </div>
  );
};
