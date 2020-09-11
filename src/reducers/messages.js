import * as types from "../constants/ActionTypes";

const initialState = null;

const messages = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_MESSAGES:
      return action.messages;
    default:
      return state;
  }
};

export default messages;
