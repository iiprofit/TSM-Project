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

/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 *
 */
import { SPHttpClientResponse } from "@microsoft/sp-http"

/**
 * This Package Is Used To Generate Unique ID's.
 */
import * as uuid from "uuid"

/**
 * Helper Section's Methods Import.
 * @param createItemParams Insert Data Into Any Custom List Of SharePoint.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { createItemParams, listTitles } from "../../../helper"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IAddStatusTypeProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Row, Col, Input, Button, message, Spin, Form, Radio , PageHeader } from "antd"

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
type IAddStatusTypeStates = {
    isActive: boolean
    statusTypeName: string
    validated: boolean
    invalidItems: Array<string>
    showConfirmation: boolean
    saveConfirm: boolean
    isLoading: boolean
    isButtonLoading: boolean
    formTitle: string
    formDescription: string
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class AddStatusType extends React.Component<
    IAddStatusTypeProp,
    IAddStatusTypeStates
> {
    /**
     * State Initialization.
     */
    public state: IAddStatusTypeStates = {
        isActive: true,
        validated: true,
        statusTypeName: "",
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        isLoading: false,
        isButtonLoading: false,
        formTitle: "",
        formDescription: "",
    }

    /**
     * React Life Cycle Method
     */
    public componentDidMount() {}

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        // Destructuring Of States
        const {
            isActive,
            statusTypeName,
            isButtonLoading,
            isLoading,
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
                <Row>
                        <Col span={24}>
                            <div
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    padding: "2%",
                                }}
                            >
                                <PageHeader
                                    className="site-page-header"
                                    title="Add New Status Type"
                                    subTitle="Please provide all details to add new status type"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Form {...layout} labelAlign="left" style={{
                            margin: "1%",
                        }}>
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
                                placeholder="Enter status type"
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
                        {/* Status Type Activation Section End */}

                        {/* Action Button Section Start */}
                        <Form.Item>
                            <Row align="middle">
                                <Col span={3} offset={4}>
                                    <Button
                                        type="primary"
                                        loading={isButtonLoading}
                                        onClick={this.handleSubmit}
                                    >
                                        Save
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
     * This Method Perform Validation Checks
     */
    private handleSubmit = async () => {
        try {
            if (this.state.statusTypeName === "") {
                message.info(
                    "Invalid Entries. Please Enter the Required the fields"
                )
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.saveStatusType()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Redirect Users To Status Type Tab
     */
    private onCancelClick = () => {
        this.props.history.push("/admin/status-type")
    }

    /**
     * This Method Close Confirmation Dialog Box
     * !We Need to delete this code
     */
    // closeConfirmationDialog = () => {
    //   this.setState({ showConfirmation: false });
    // };

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
     * This Method Save Data Into Custom List
     */
    private saveStatusType = async () => {
        const { isActive, statusTypeName } = this.state
        const { absUrl } = this.props
        const { url, config, options } = createItemParams({
            absoluteUrl: absUrl,
            listTitle: listTitles.STATUS_TYPE,
            body: {
                __metadata: { type: "SP.Data.StatusTypeListItem" },
                StatusTypeName: statusTypeName,
                isActive: isActive,
                uuid: uuid.v4(),
            },
        })

        try {
            const response: SPHttpClientResponse = await this.props.httpClient.post(
                url,
                config,
                options
            )
            const result = await response.json()

            result.Id
                ? this.setState(
                      {
                          isButtonLoading: false,
                          statusTypeName: null,
                      },
                      () => {
                          message.success("Data Inserted Successfully")
                      }
                  )
                : this.setState({ isButtonLoading: false }, () => {
                      message.error("Something Is Wrong!!! Try Again Latter")
                  })

            // if (result.status == 200) {
            //     this.setState({ isButtonLoading: false }, () => {
            //         message.success("Status Type Inserted Successfully")
            //     })
            // } else {
            //     this.setState({ isButtonLoading: false }, () => {
            //         message.error("Something Is Wrong!!! Try Again Latter")
            //     })
            // }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Is Used To Take Final Save Confirmation
     *  !We Need to delete this code
     */
    // onSaveConfirm = () => {
    //   this.saveStatusType().then(() => {
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
export default connect(mapStateToProps)(AddStatusType)
