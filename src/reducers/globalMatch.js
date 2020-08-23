import * as types from "../constants/ActionTypes";

const initialState = null;

const globalMatch = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_GLOBAL_MATCH:
      return action.match;
    default:
      return state;
  }
};

export default globalMatch;
