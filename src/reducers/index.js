import { combineReducers } from "redux";

import project from "./project";
import tasks from "./tasks";

const reducer = combineReducers({
  project,
  tasks,
});

export default reducer;
