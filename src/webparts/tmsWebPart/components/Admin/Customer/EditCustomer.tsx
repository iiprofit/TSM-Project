/**
 * React Package Import
 */
import * as React from "react"

/**
 * Component Specific CSS Import
 */
import "./Customer.scss"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

import { readItemParams, listTitles, updateItemParams } from "../../../helper"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IEditCustomerProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Row, Col, Input, Button, message, Spin, Form } from "antd"

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
type IEditCustomerStates = {
    isActive: boolean
    customerName: string
    customerEmail: string
    customerCity: string
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
class IEditCustomer extends React.Component<
    IEditCustomerProp,
    IEditCustomerStates
> {
    /**
     * State Initialization.
     */
    public state: IEditCustomerStates = {
        isActive: true,
        customerName: "",
        customerEmail: "",
        customerCity: "",
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
     * This Method Call Method Which Fetch Specific Customer Data.
     */
    public componentDidMount() {
        try {
            if (this.props.match.params.id) {
                const _id = parseInt(this.props.match.params.id)
                this.fetchCustomerDetails(_id)
            }
        } catch (error) {
            console.error("Error while Edit Customer componentDidMount")
        }
    }

    /**
     * Render() Method
     */
    render(): React.ReactElement {
        const {
            isActive,
            validated,
            customerName,
            invalidItems,
            showConfirmation,
            saveConfirm,
            customerCity,
            customerEmail,
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
                    <Form {...layout} labelAlign="left">
                        {/* Customer Name Section Start  */}
                        <Form.Item label="Customer Name">
                            <Input
                                defaultValue={customerName}
                                value={customerName}
                                onChange={(e) =>
                                    this.setState({
                                        customerName: e.target.value,
                                    })
                                }
                                placeholder="Enter customer name"
                            />
                        </Form.Item>
                        {/* Customer Name Section End  */}

                        {/* Customer City Section Start  */}
                        <Form.Item label="City">
                            <Input
                                defaultValue={customerCity}
                                value={customerCity}
                                onChange={(e) =>
                                    this.setState({
                                        customerCity: e.target.value,
                                    })
                                }
                                placeholder="Enter city"
                            />
                        </Form.Item>
                        {/* Customer City Section End  */}

                        {/* Customer Email Address Section Start  */}
                        <Form.Item label="Email Address">
                            <Input
                                defaultValue={customerEmail}
                                value={customerEmail}
                                onChange={(e) =>
                                    this.setState({
                                        customerCity: e.target.value,
                                    })
                                }
                                placeholder="Enter email address"
                            />
                        </Form.Item>
                        {/* Customer Email Address Section End  */}

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
    fetchCustomerDetails = async (itemId) => {
        try {
            const { httpClient, absUrl } = this.props
            const param = readItemParams({
                absoluteUrl: absUrl,
                itemId: itemId,
                listTitle: listTitles.CUSTOMER_INFORMATION,
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
                customerName: _item.CustomerName,
                customerEmail: _item.CustomerEmail,
                customerCity: _item.CustomerCity,
                isActive: _item.IsActive,
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
            if (
                this.state.customerName === "" ||
                this.state.customerCity === "" ||
                this.state.customerEmail === ""
            ) {
                message.info(
                    "Invalid Entries. Please Enter the Required the fields"
                )
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.updateCustomer()
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
        this.props.history.push("/admin/customer-information")
    }

    /**
     * This Method Update Data Of Custom List.
     */
    private updateCustomer = async () => {
        try {
            const {
                isActive,
                customerName,
                etag,
                customerCity,
                customerEmail,
            } = this.state
            const { absUrl, match, httpClient } = this.props
            const { url, config, options } = updateItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.STATUS_TYPE,
                body: {
                    __metadata: { type: "SP.Data.ChecklistItemTableListItem" },
                    CustomerName: customerName,
                    CustomerEmail: customerEmail,
                    CustomerCity: customerCity,
                    IsActive: isActive,
                },
                etag: etag,
                itemId: parseInt(match.params.id),
            })
            const response = await httpClient.post(url, config, options)

            const result = await response.json()
            if (result.status == 200) {
                this.setState({ isButtonLoading: false }, () => {
                    message.success("Data Updated Successfully")
                })
            } else {
                this.setState({ isButtonLoading: false }, () => {
                    message.error("Something Is Wrong!!! Try Again Latter")
                })
            }
        } catch (error) {
            console.error("Error while update Customer " + error)
        }
    }

    /**
     * This Method Close Confirmation Dialog Box.
     * ! I Need To Delete This Code
     */
    // closeConfirmationDialog = () => {
    //   this.setState({ showConfirmation: false });
    // };

    /**
     * This Method Close Save Confirmation Dialog Box.
     * Redirect The User To Customer Tab.
     * ! I Need To Delete This Code
     */
    // closeSaveConfirmDialog = () => {
    //   this.setState({ saveConfirm: false });
    //   this.props.history.push("/admin/customer-information");
    // };

    /**
     * This Method Take Final Confirmation From User And Call Update Customer Method.
     * ! I Need To Delete This Code
     */
    // onUpdateConfirm = () => {
    //   this.updateCustomer().then(() => {
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
export default connect(mapStateToProps)(IEditCustomer)
