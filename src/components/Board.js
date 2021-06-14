import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

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
  // getProject,
  deleteTaskRequest,
  updateStatusTaskRequest,
  updatePositonLaneRequest,
  removeLaneRequest,
  setGlobalMatch,
  setNotifications,
} from "../actions/index";

export default ({ match }) => {
  const { query } = useLocation();

  const [data, setData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const [cardId, setCardId] = useState("");
  const [sourceLaneId, setSourceLaneId] = useState("");
  const [targetLaneId, setTargetLaneId] = useState("");

  const [loading, setLoading] = useState(true);

  const project = useSelector((state) => state.project);
  const notifications = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (query && query.notifyTaskId) {
      const curNotifications = { ...notifications };
      const seenNoti = curNotifications[project.id].find(
        (noti) =>
          noti.taskId === query.notifyTaskId && noti.type === query.notiType
      );

      const seenIndex = curNotifications[project.id].indexOf(seenNoti);
      curNotifications[project.id].splice(seenIndex, 1);

      seenNoti.seen = true;
      curNotifications["seen"] = seenNoti;

      dispatch(setNotifications(curNotifications));
    }
  }, []);

  useEffect(() => {
    dispatch(setGlobalMatch(match));

    // if (project && project.id === match.params.id) return;
    // dispatch(getProject(match.params.id));
  }, [match.params.id]);

  useEffect(() => {
    if (project) {
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
    dispatch(deleteTaskRequest(cardId, laneId, user.id));
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

  const handleLaneDragEnd = (lastIndex, newIndex, lane) => {
    dispatch(updatePositonLaneRequest(project.id, lastIndex, newIndex));
  };

  const onDataChange = (newData) => {
    if (data && isUpdate) {
      const lane = newData.lanes.find((lane) => lane.id === targetLaneId);
      lane.tasks = lane.cards;
      dispatch(
        updateStatusTaskRequest(cardId, lane, sourceLaneId, targetLaneId)
      );
      setIsUpdate(false);
    }
  };

  const handleLandDelete = (laneId) => {
    dispatch(removeLaneRequest(laneId, user.id));
  };

  return loading ? (
    <div className="loader">
      <Loader />
    </div>
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
        handleLaneDragEnd={handleLaneDragEnd}
        onDataChange={onDataChange}
        onLaneDelete={handleLandDelete}
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
};;
