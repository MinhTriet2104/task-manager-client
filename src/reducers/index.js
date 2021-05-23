import { combineReducers } from "redux";

import project from "./project";
import messages from "./messages"
import loading from "./loading";
import globalMatch from "./globalMatch";
import user from "./user";
import notifications from "./notifications";
import socket from "./socket";

const reducer = combineReducers({
  project,
  messages,
  loading,
  globalMatch,
  user,
  notifications,
  socket,
});

export default reducer;
