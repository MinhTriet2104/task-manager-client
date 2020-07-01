import * as types from "../constants/ActionTypes";

export const setTasks = (tasks) => ({
  type: types.SET_TASKS,
  tasks,
});

export const addTask = (task) => ({
  type: types.ADD_TASK,
  task,
});

export const deleteTask = (id) => ({
  type: types.DELETE_TASK,
  id,
});
