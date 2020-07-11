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

export const deleteTaskRequest = (id) => async (dispatch) => {
  dispatch(setLoadingProject(true));
  const res = await axios.delete("http://localhost:2104/task/" + id);
  dispatch(deleteTask(res.data));
  dispatch(setLoadingProject(false));
};

export const deleteTask = (id) => ({
  type: types.DELETE_TASK,
  id,
});

export const updateStatusTaskRequest = (id, status) => async (dispatch) => {
  // dispatch(setLoadingProject(true));
  // const res = await axios.patch("http://localhost:2104/task/" + id, {
  //   status: status,
  // });
  await axios.patch("http://localhost:2104/task/" + id, {
    status: status,
  });
  // dispatch(updateStatusTask(res.data));
  // dispatch(setLoadingProject(false));
};

export const updateStatusTask = (id) => ({
  type: types.UPDATE_STATUS_TASK,
  id,
});

export const setLoadingTask = (status) => ({
  type: types.SET_LOADING_TASK,
  status,
});

export const setLoadingProject = (status) => ({
  type: types.SET_LOADING_PROJECT,
  status,
});
