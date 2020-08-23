import { combineReducers } from "redux";

import project from "./project";
import loading from "./loading";
import globalMatch from "./globalMatch";

const reducer = combineReducers({
  project,
  loading,
  globalMatch,
});

export default reducer;
