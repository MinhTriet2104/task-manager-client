import * as types from "../constants/ActionTypes";

const initialState = {
  loadingProject: true,
  loadingTask: true,
};

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOADING_TASK:
      return {
        ...state,
        loadingTask: action.status,
      };
    case types.SET_LOADING_PROJECT:
      return {
        ...state,
        loadingProject: action.status,
      };
    default:
      return state;
  }
};

export default tasks;
