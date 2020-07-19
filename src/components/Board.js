import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Board from "react-trello";
import CustomCard from "./CustomCard";
import Loader from "./Loader";
import CustomFooter from "./CustomFooter";
import CustomHeader from "./CustomHeader";

// action
import {
  getProject,
  deleteTaskRequest,
  updateStatusTaskRequest,
} from "../actions/index";

export default ({ match }) => {
  const [data, setData] = useState({});
  const project = useSelector((state) => state.project);
  const loading = useSelector((state) => state.loading.loadingProject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (project) {
      project.tasks.map((task) => (task.id = task._id));
      const tasks = project.tasks;
      setData({
        lanes: [
          {
            id: "lane-1",
            title: "Pending",
            style: {
              width: 280,
              backgroundColor: "#ebecf0",
            },
            cards: tasks.filter((task) => task.status === 1),
          },
          {
            id: "lane-2",
            title: "TODO",
            style: {
              width: 280,
              backgroundColor: "#ebecf0",
            },
            cards: tasks.filter((task) => task.status === 2),
          },
          {
            id: "lane-3",
            title: "IN PROGRESS",
            style: {
              width: 280,
              backgroundColor: "#ebecf0",
            },
            cards: tasks.filter((task) => task.status === 3),
          },
          {
            id: "lane-4",
            title: "Done",
            style: {
              width: 280,
              backgroundColor: "#ebecf0",
            },
            cards: tasks.filter((task) => task.status === 4),
          },
        ],
      });
    }
  }, [project]);

  const onCardDelete = (cardId, laneId) => {
    dispatch(deleteTaskRequest(cardId));
  };

  const handleDragStart = (cardId, laneId) => {
    // console.log("drag started");
    // console.log(`cardId: ${cardId}`);
    // console.log(`laneId: ${laneId}`);
  };

  const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    const status = targetLaneId.split("-")[1];
    dispatch(updateStatusTaskRequest(cardId, status));
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
      components={{
        LaneHeader: CustomHeader,
        Card: CustomCard,
        LaneFooter: CustomFooter,
      }}
    />
  );
};
