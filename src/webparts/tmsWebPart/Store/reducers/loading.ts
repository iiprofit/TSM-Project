import { types } from "../actions/loading";
import { Reducer } from "redux";

const initialState = {
  isLoading: false
};

export type ILoadingState = typeof initialState;
const loadingReducer: Reducer<ILoadingState> = (
  state: ILoadingState = initialState,
  action
) => {
  let newState = (<any>Object).assign({}, state) as ILoadingState;
  switch (action.type) {
    case types.UPDATE_IS_LOADING: {
      newState.isLoading = action.payload;
      return newState;
    }
    default:
      return state as any;
  }
};
export default loadingReducer;
