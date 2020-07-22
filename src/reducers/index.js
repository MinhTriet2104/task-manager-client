import { combineReducers } from "redux";

import project from "./project";
import loading from "./loading";

const reducer = combineReducers({
  project,
  // tasks,
  loading,
});

export default reducer;
