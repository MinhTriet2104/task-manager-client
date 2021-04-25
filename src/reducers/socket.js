import * as types from "../constants/ActionTypes";

let initialState = null;

const socket = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SOCKET:
      return { ...action.socket };
    default:
      return state;
  }
};

export default socket;
