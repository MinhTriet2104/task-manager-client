import axios from "axios";

import * as types from "../constants/ActionTypes";

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

export const deleteTask = (id) => ({
  type: types.DELETE_TASK,
  id,
});
