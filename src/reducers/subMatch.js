import * as types from "../constants/ActionTypes";

const initialState = "board";

const tasks = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SUB_MATCH:
      return action.subMatch;
    default:
      return state;
  }
};

export default tasks;
