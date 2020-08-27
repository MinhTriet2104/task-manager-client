import { combineReducers } from "redux";

import project from "./project";
import loading from "./loading";
import globalMatch from "./globalMatch";
import user from "./user";

const reducer = combineReducers({
  project,
  loading,
  globalMatch,
  user,
});

export default reducer;
