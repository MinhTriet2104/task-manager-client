import * as types from "../constants/ActionTypes";

let initialState = null;

const notifications = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_NOTIFICATIONS:
      return { ...action.notifications };
    default:
      return state;
  }
};

export default notifications;
