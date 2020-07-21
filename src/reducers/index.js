import { combineReducers } from "redux";

import project from "./project";
import loading from "./loading";

const reducer = combineReducers({
  project,
  loading,
});

export default reducer;
