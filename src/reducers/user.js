import * as types from "../constants/ActionTypes";

let initialState = null;

const userCache = localStorage.getItem("user");
if (userCache) initialState = JSON.parse(userCache);

const user = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER:
      const { user } = action;
      console.log("SET USER:", user);
      if (user)
        localStorage.setItem("user", JSON.stringify(user));
      else
        localStorage.removeItem("user");
      return { ...user };
    default:
      return state;
  }
};

export default user;
