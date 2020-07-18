import axios from "axios";

import * as types from "../constants/ActionTypes";

export const getProject = (id) => async (dispatch) => {
  const res = await axios.get(`http://localhost:2104/project/${id}`);
  dispatch(setProject(res.data));
  // dispatch(setTasks(res.data.tasks));
  dispatch(setLoadingProject(false));
  // dispatch(setLoadingTask(false));
};

export const setProject = (project) => ({
  type: types.SET_PROJECT,
  project,
});

export const setTasks = (tasks) => ({
  type: types.SET_TASKS,
  tasks,
});

export const addTaskRequest = (task) => async (dispatch) => {
  const res = await axios.post("http://localhost:2104/task", task);
  dispatch(addTask(res.data));
};

export const addTask = (task) => ({
  type: types.ADD_TASK,
  task,
});

export const deleteTaskRequest = (id, laneId) => async (dispatch) => {
  // dispatch(setLoadingProject(true));
  const res = await axios.delete("http://localhost:2104/task/" + id, {
    laneId: laneId,
  });
  dispatch(deleteTask(res.data, laneId));
  // dispatch(setLoadingProject(false));
};

export const deleteTask = (id, laneId) => ({
  type: types.DELETE_TASK,
  id,
  laneId,
});

export const updateStatusTaskRequest = (
  id,
  lane,
  sourceLaneId,
  targetLaneId
) => async (dispatch) => {
  // const res = await axios.patch("http://localhost:2104/task/" + id, {
  //   lane: lane,
  //   sourceLaneId: sourceLaneId,
  //   targetLaneId: targetLaneId,
  // });

  // dispatch(updateStatusTask(res.data, lane, sourceLaneId, targetLaneId));
  dispatch(updateStatusTask(id, lane, sourceLaneId, targetLaneId));
};

export const updateStatusTask = (id, lane, sourceLaneId, targetLaneId) => ({
  type: types.UPDATE_STATUS_TASK,
  id,
  lane,
  sourceLaneId,
  targetLaneId,
});

export const setLoadingTask = (status) => ({
  type: types.SET_LOADING_TASK,
  status,
});

export const setLoadingProject = (status) => ({
  type: types.SET_LOADING_PROJECT,
  status,
});
