import { types } from "../actions/login";
import { Reducer } from "redux";
import { rightsBoolean } from "../../helper";

export type User = {
    displayName: string;
    email: string;
    loginName: string;
    rights: rightsBoolean;
    isAuthenticated: boolean;
    userId: number;
  };
  
  const initialState = {
    user: {
      displayName: null,
      email: null,
      isAuthenticated: false,
      loginName: "",
      rights: null,
      userId: null
    } as User
  };
  
  export type ILoginState = typeof initialState;
  const loginReducer: Reducer<ILoginState> = (
    state: ILoginState = initialState,
    action
  ) => {
    let newState = (<any>Object).assign({}, state) as ILoginState;
    switch (action.type) {
      case types.UPDATE_USER: {
        newState.user = action.payload;
        return newState;
      }
      default:
        return state as any;
    }
  };
  export default loginReducer;