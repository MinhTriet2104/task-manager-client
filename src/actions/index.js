import axios from "axios";

import * as types from "../constants/ActionTypes";

export const getProject = (id) => async (dispatch) => {
  const res = await axios.get(`http://localhost:2104/project/${id}`);
  dispatch(setProject(res.data));
  dispatch(setTasks(res.data.tasks));
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
  const res = await axios.delete("http://localhost:2104/task/" + id);
  dispatch(deleteTask(res.data));
};

export const deleteTask = (id) => ({
  type: types.DELETE_TASK,
  id,
});

export const updateStatusTaskRequest = (id, status) => async (dispatch) => {
  const res = await axios.patch("http://localhost:2104/task/" + id, {
    status: status,
  });
  dispatch(updateStatusTask(res.data));
};

export const updateStatusTask = (task) => ({
  type: types.UPDATE_STATUS_TASK,
  task,
});
