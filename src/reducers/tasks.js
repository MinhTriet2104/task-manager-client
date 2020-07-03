import * as types from "../constants/ActionTypes";

const initialState = [];

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TASKS:
      return [...action.tasks];
    case types.ADD_TASK:
      return [...state, action.task];
    default:
      return state;
  }
};

export default tasks;
