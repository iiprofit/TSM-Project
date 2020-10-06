import { types } from "../actions/dashboard";
import { Reducer } from "redux";
import { SPHttpClient } from "@microsoft/sp-http";

const initialState = {
  absoluteUrl: "",
  activeTab: "",
  httpClient: null as SPHttpClient
};



export type IDashboardState = typeof initialState;
const dashboardReducer: Reducer<IDashboardState> = (
  state: IDashboardState = initialState,
  action
) => {
  let newState = (<any>Object).assign({}, state) as IDashboardState;
  switch (action.type) {
    case types.UPDATE_ABSOLUTE_URL: {
      newState.absoluteUrl = action.payload;
      return newState;
    }
    case types.UPDATE_ACTIVE_TAB: {
      newState.activeTab = action.payload;
      return newState;
    }
    case types.UPDATE_SP_HTTP_CLIENT: {
      newState.httpClient = action.payload;
      return newState;
    }
    default:
      return state as any;
  }
};
export default dashboardReducer;
