/**
 * React Package Import
 */
import * as React from "react"

/**
 * Component Specific CSS Import
 */
import "./Users.scss"

/**
 * React-Router Paclage Import
 * @param Link This Method us used to Redirect Users To Specfic Section.
 */
import { Link } from "react-router-dom"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IEditUserProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import {
    Row,
    Col,
    Button,
    message,
    Select,
    Spin,
    Form,
    Radio,
    Checkbox,
} from "antd"

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
 * Helper Section's Methods Import.
 * @param updateItemParams Update Data Of Any Custom List Of SharePoint.
 * @param readItemParams Fetch Single List Item From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemParams, listTitles, updateItemParams } from "../../../helper"

/**
 * Types Declaration Of Current Component States
 */
type IEditUserState = {
    username: string
    selectedUser: any
    email: string
    etag: any
    isActive: boolean
    requester: boolean
    admin: boolean
    validated: boolean
    invalidItems: Array<string>
    showConfirmation: boolean
    updateConfirm: boolean
    isLoading: boolean
    isButtonLoading: boolean
    roleOptions: Array<any>
    DefaultroleOptions: Array<any>
    selectedRole: any
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class EditUser extends React.Component<IEditUserProp, IEditUserState> {
    /**
     * State Initialization.
     */
    public state: IEditUserState = {
        email: "",
        isActive: true,
        username: null,
        admin: false,
        requester: false,
        validated: true,
        invalidItems: [],
        selectedUser: [],
        showConfirmation: false,
        updateConfirm: false,
        etag: null,
        isLoading: false,
        isButtonLoading: false,
        roleOptions: [
            { label: "Admin", value: "admin" },
            { label: "Requester", value: "requester" },
        ],
        selectedRole: null,
        DefaultroleOptions: [],
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch Details Of Specific User.
     */
    public componentDidMount() {
        try {
            if (this.props.match.params.id) {
                const _id = parseInt(this.props.match.params.id)
                this.fetchUserDetails(_id)
            } else {
                throw "id not found"
            }
        } catch (error) {
            console.error("Error while componentDidMount", error)
        }
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        // Destructuring Of States
        const {
            username,
            isActive,
            isLoading,
            isButtonLoading,
            roleOptions,
            selectedRole,
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
                        {/* User Name Section Start  */}
                        <Form.Item label="User Name">
                            <Select
                                placeholder="Inserted are removed"
                                value={username}
                                disabled
                                style={{ width: "100%" }}
                            ></Select>
                        </Form.Item>
                        {/* User Name Section End  */}

                        {/* User Role Selection Section Start */}
                        <Form.Item label="Roles">
                            <Checkbox.Group
                                options={roleOptions}
                                onChange={this.onRoleChange}
                                value={selectedRole}
                            />
                        </Form.Item>

                        {/* User Role Selection Section End */}

                        {/* User Activation Section Start */}
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
                        {/* User Activation Section End */}

                        {/* Action Button Section Start */}
                        <Form.Item>
                            <Row align="middle">
                                <Col span={3} offset={4}>
                                    <Button
                                        type="primary"
                                        loading={isButtonLoading}
                                        onClick={this.handleSubmit}
                                    >
                                        Submit
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
     * This Method Check The Selected Roles And Update Values Of State Accordingly.
     */

    onRoleChange = (checkedValues) => {
        try {
            this.setState({ selectedRole: checkedValues })
            // if (checkedValues.includes("admin")) {
            //     this.setState({ admin: true })
            // } else {
            //     this.setState({ admin: false })
            // }

            // if (checkedValues.includes("requester")) {
            //     this.setState({ requester: true })
            // } else {
            //     this.setState({ requester: false })
            // }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Fetch Specific User Data Based On Passed ID By Parent Component.
     * @param userId As Name Suggest This Method Use This Id For Fetching Specific User's Data
     */
    private fetchUserDetails = async (userId) => {
        try {
            const { httpClient, absUrl } = this.props
            const param = readItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.USER_ROLE_TABLE,
                itemId: userId,
                filters: "$select=*,Email/EMail&$expand=Email/EMail",
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
            const _user = result
            let rights: Array<any> = _user.Rights.split(",")
            this.setState({
                admin: rights.indexOf("admin") === -1 ? false : true,
                requester: rights.indexOf("requester") === -1 ? false : true,
                email: _user.Email.EMail,
                isActive: _user.isActive,
                username: _user.FirstName,
                selectedRole: rights,
            })
        } catch (error) {
            console.error("Error while fetchUserDetails", error)
        }
    }

    /**
     * This Method Convert Boolean Role Value Into String
     */
    private rightsToString = () => {
        const { admin, requester } = this.state
        let rights = []
        requester && rights.push("requester")
        admin && rights.push("admin")
        return rights.join(",")
    }

    // On form submit - on Update button click
    private handleSubmit = () => {
        try {
            const { admin, requester, selectedRole } = this.state

            if (!selectedRole && !selectedRole.length) {
                message.info("Please check at least one from the Rights.")
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.updateUser()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Click event for Cancel button on form
    private onCancelClick = () => {
        this.props.history.push("/admin/users")
    }

    /**
     * ! I Need to Check Fields Of SharePoint List
     * This Method As Name Suggest Update Data Into SharePoint Custom List
     */
    private updateUser = async () => {
        try {
            const { username, isActive, etag, selectedRole } = this.state
            const { absUrl, match, httpClient } = this.props
            const { url, config, options } = updateItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.USER_ROLE_TABLE,
                body: {
                    __metadata: { type: "SP.Data.UserRolesTableListItem" },
                    Rights: selectedRole.join(","),
                    isActive: isActive,
                },
                etag: etag,
                itemId: parseInt(match.params.id),
            })
            const response = await httpClient.post(url, config, options)
            console.log(response)

            if (response.status == 204) {
                this.setState({ isButtonLoading: false }, () => {
                    message.success("User Updated Successfully")
                    this.props.history.push("/admin/users")
                })
            } else {
                this.setState({ isButtonLoading: false }, () => {
                    message.error("Something Is Wrong!!! Try Again Latter")
                })
            }
        } catch (error) {
            console.error("Error while updateUser", error)
        }
    }

    /**
     * This Method Close Confirmation Box.
     * *!We Need to delete this code
     */
    // private closeConfirmationDialog = () =>
    //   this.setState({ showConfirmation: false });

    /**
     * This Method Close Update  Confirmation Box.
     *  !We Need to delete this code
     */
    // private closeUpdateConfirmDialog = () => {
    //   this.setState({ updateConfirm: false });
    //   this.props.history.push("/admin/users");
    // };

    /**
     * This Method Update States When Update Is Confirm By User.
     *  !We Need to delete this code
     */
    // private onUpdateConfirm = () => {
    //   this.updateUser().then(() => {
    //     this.closeConfirmationDialog();
    //     this.setState({ updateConfirm: true });
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
export default connect(mapStateToProps)(EditUser)
