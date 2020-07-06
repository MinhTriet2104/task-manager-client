import * as types from "../constants/ActionTypes";

const initialState = {};

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PROJECT:
      return { ...action.project };
    default:
      return state;
  }
};

export default tasks;
