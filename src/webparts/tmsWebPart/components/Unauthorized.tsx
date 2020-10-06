import * as React from "react"
import { connect } from "react-redux"
import { IUnauthorizedProp } from "../Store/Types"

import { Row, Col } from "antd"

type IUnauthorizedState = {}

class Unauthorized extends React.Component<
    IUnauthorizedProp,
    IUnauthorizedState
> {
    public render(): React.ReactElement {
        return (
            <>
                <div className="unauthorized">
                    <Row>
                        <Col sm="12">
                            <div className="header">
                                <span>Version: {this.props.version}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="smiley">
                                <label>Icon</label>
                            </div>
                            <h1>
                                You are not authorized to access this section.
                            </h1>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    absUrl: state.dashboard.absoluteUrl,
    httpClient: state.dashboard.httpClient,
})

export default connect(mapStateToProps)(Unauthorized)
