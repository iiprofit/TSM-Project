import { combineReducers } from "redux";
import dashboard from "./dashboard";
import loading from "./loading";
import login from "./login";
const rootReducer = combineReducers({ dashboard, loading, login });
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
