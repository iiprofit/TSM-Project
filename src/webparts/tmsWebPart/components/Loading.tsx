import * as React from "react";
import { connect } from "react-redux";
import { ILoadingProp } from "../Store/Types";
type ILoadingState = {};

class Loading extends React.Component<ILoadingProp, ILoadingState> {
  public render(): React.ReactElement {
    return (
      <div></div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Loading);
