import * as types from "../constants/ActionTypes";

let initialState = null;

const userCache = localStorage.getItem("user");
if (userCache) initialState = JSON.parse(userCache);

const user = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER:
      const { user } = action;
      localStorage.setItem("user", JSON.stringify(user));
      return { ...user };
    default:
      return state;
  }
};

export default user;
