import * as types from "../constants/ActionTypes";

const initialState = [];

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TASKS:
      return [...action.tasks];
    case types.ADD_TASK:
      return [...state, action.task];
    case types.DELETE_TASK: {
      const findItem = state.find((item) => item._id === action.id);
      const index = state.indexOf(findItem);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    default:
      return state;
  }
};

export default tasks;
