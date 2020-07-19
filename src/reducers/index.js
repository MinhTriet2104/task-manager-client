import { combineReducers } from "redux";

import project from "./project";
import tasks from "./tasks";
import loading from "./loading";

const reducer = combineReducers({
  project,
  // tasks,
  loading,
});

export default reducer;
