import * as types from "../constants/ActionTypes";

const initialState = [];

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TASKS: {
      const { tasks } = action;
      return [...tasks];
    }
    default:
      return state;
  }
};

export default tasks;
