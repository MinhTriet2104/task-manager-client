import * as types from "../constants/ActionTypes";

const initialState = null;

const user = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER:
      return { ...action.user };
    default:
      return state;
  }
};

export default user;
