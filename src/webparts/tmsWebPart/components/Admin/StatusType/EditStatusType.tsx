/**
 * React Package Import
 */
import * as React from "react"

/**
 * Component Specific CSS Import
 */
// import "./StatusType.scss"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

import { readItemParams, listTitles, updateItemParams } from "../../../helper"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IEditStatusTypeProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Row, Col, Input, Button, message, Spin, Form, Radio } from "antd"

/**
 * Ant Design Icons Import
 */
import { LoadingOutlined } from "@ant-design/icons"

/**
 * Custom Component Import.
 * This Component Take Final Confirmaiton Of User.
 */
import ConfirmationDialog from "../../Dialogs/ConfirmationDialog"

/**
 * Custom Component Import.
 * This Component Show Success Message Of Any Operation Performed By User.
 */
import SuccessDialog from "../../Dialogs/SuccessDialog"

/**
 * Types Declaration Of Current Component States
 */
type IEditStatusTypeStates = {
    isActive: boolean
    statusTypeName: string
    validated: boolean
    invalidItems: Array<string>
    showConfirmation: boolean
    saveConfirm: boolean
    etag: any
    isLoading: boolean
    isButtonLoading: boolean
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class IEditStatusType extends React.Component<
    IEditStatusTypeProp,
    IEditStatusTypeStates
> {
    /**
     * State Initialization.
     */
    public state: IEditStatusTypeStates = {
        isActive: true,
        statusTypeName: "",
        validated: true,
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        etag: null,
        isButtonLoading: false,
        isLoading: false,
    }

    /**
     * React Life Cycle Method.
     * This Method Call Method Which Fetch Specific Status Type Data.
     */
    public componentDidMount() {
        try {
            if (this.props.match.params.id) {
                const _id = parseInt(this.props.match.params.id)
                this.fetchStatusTypeDetails(_id)
            }
        } catch (error) {
            console.error("Error while Edit Status-Type componentDidMount")
        }
    }

    /**
     * Render() Method
     */
    render(): React.ReactElement {
        // Destructuring Of States
        const {
            isActive,
            statusTypeName,
            isLoading,
            isButtonLoading,
        } = this.state

        /**
         *  Form Layout Attributes.
         *  Form Design Based On Below Mentioned Attributes.
         */
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        }

        return (
            <>
                {/* Spin Component Is Used For Loading Process */}
                {/* We Need To impliment Is loading In Spin */}
                <Spin spinning={isLoading} indicator={loadingIcon}>
                    <Form {...layout} labelAlign="left">
                        {/* Status Type Name Section Start */}
                        <Form.Item label="Status Type Name">
                            <Input
                                defaultValue={statusTypeName}
                                value={statusTypeName}
                                onChange={(e) =>
                                    this.setState({
                                        statusTypeName: e.target.value,
                                    })
                                }
                                placeholder="Enter status name"
                            />
                        </Form.Item>
                        {/* Status Type Name Section End */}

                        {/* Status Type Activation Section Start */}
                        <Form.Item label="Is Active">
                            <Radio.Group
                                onChange={(e) =>
                                    this.setState({ isActive: e.target.value })
                                }
                                value={isActive}
                            >
                                <Radio value={true}>True</Radio>
                                <Radio value={false}>False</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/* Status Type Activation Section Start */}

                        {/* Action Button Section Start */}
                        <Form.Item>
                            <Row align="middle">
                                <Col span={3} offset={4}>
                                    <Button
                                        type="primary"
                                        loading={isButtonLoading}
                                        onClick={this.handleSubmit}
                                    >
                                        Update
                                    </Button>
                                </Col>
                                <Col span={3} offset={10}>
                                    <Button
                                        type="primary"
                                        onClick={this.onCancelClick}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                        {/* Action Button Section End */}
                    </Form>
                </Spin>
            </>
        )
    }

    /**
     * This Method Specific Data Based On Given It
     */
    fetchStatusTypeDetails = async (itemId) => {
        try {
            const { httpClient, absUrl } = this.props
            const param = readItemParams({
                absoluteUrl: absUrl,
                itemId: itemId,
                listTitle: listTitles.STATUS_TYPE,
                filters: "",
            })
            const response = await httpClient.get(
                param.url,
                param.config,
                param.options
            )
            const result = await response.json()
            this.setState({
                etag: response.headers.get("ETag"),
            })
            const _item = result
            this.setState({
                statusTypeName: _item.StatusTypeName,
                isActive: _item.isActive,
            })
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Perform Validation Checks
     */
    handleSubmit = async () => {
        try {
            if (this.state.statusTypeName === "") {
                message.info(
                    "Invalid Entries. Please Enter the Required the fields"
                )
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.updateStatusType()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Redirect Users To Customer Tab
     */
    onCancelClick = () => {
        this.props.history.push("/admin/status-type")
    }

    /**
     * This Method Update Data Of Custom List.
     */
    private updateStatusType = async () => {
        try {
            const { isActive, statusTypeName, etag } = this.state
            const { absUrl, match, httpClient } = this.props
            const { url, config, options } = updateItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.STATUS_TYPE,
                body: {
                    __metadata: { type: "SP.Data.StatusTypeListItem" },
                    StatusTypeName: statusTypeName,
                    isActive: isActive,
                },
                etag: etag,
                itemId: parseInt(match.params.id),
            })
            const response = await httpClient.post(url, config, options)
            let result = response

            if (result.status == 204) {
                this.setState({ isButtonLoading: false }, () => {
                    message.success("Data Update Successfully")
                })
            } else {
                this.setState({ isButtonLoading: false }, () => {
                    message.error("Something Is Wrong!!! Try Again Latter")
                })
            }
        } catch (error) {
            console.error("Error while update status-type " + error)
        }
    }

    /**
     * This Method Close Confirmation Dialog Box
     */
    closeConfirmationDialog = () => {
        this.setState({ showConfirmation: false })
    }

    /**
     * This Method Close Save Confirmation Dialog Box
     * Redirect The User To Status Type Tab
     * !We Need to delete this code
     */
    // closeSaveConfirmDialog = () => {
    //   this.setState({ saveConfirm: false });
    //   this.props.history.push("/admin/status-type");
    // };

    /**
     * This Method Take Final Confirmation From User And Call Update Status Type Method
     * !We Need to delete this code
     */
    // onUpdateConfirm = () => {
    //   this.updateStatusType().then(() => {
    //     this.closeConfirmationDialog();
    //     this.setState({ saveConfirm: true });
    //   });
    // };
}

/**
 * Redux Map Funtion Which Map Global Store's State To Props Of Current Component.
 */
const mapStateToProps = (state) => ({
    absUrl: state.dashboard.absoluteUrl,
    httpClient: state.dashboard.httpClient,
})

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(IEditStatusType)
