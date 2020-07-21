import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Board from "react-trello";
import CustomCard from "./CustomCard";
import CustomFooter from "./CustomFooter";
import CustomHeader from "./CustomHeader";
import Loader from "./Loader";

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
  const project = useSelector((state) => state.project);
  // const tasks = useSelector((state) => state.tasks);
  const loading = useSelector((state) => state.loading.loadingProject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project && !data) {
      const lanes = [];
      project.lanes.forEach((lane) => {
        lanes.push({
          ...lane,
          title: lane.name,
          style: {
            width: 280,
            backgroundColor: "#ebecf0",
          },
          cards: lane.tasks,
        });
      });
      setData({
        lanes: lanes,
      });
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
    <Board
      data={data}
      style={{
        backgroundColor: "transparent",
        height: "calc(100vh - 58px)",
      }}
      collapsibleLanes
      draggable
      onCardDelete={onCardDelete}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      onDataChange={onDataChange}
      onCardClick={onCardClick}
      components={{
        LaneHeader: CustomHeader,
        Card: CustomCard,
        LaneFooter: CustomFooter,
      }}
    />
  );
};
