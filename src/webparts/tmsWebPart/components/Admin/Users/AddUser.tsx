/**
 * React Package Import
 */
import * as React from "react"

/**
 * Component Specific CSS Import
 */
import "./Users.scss"

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
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http"

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
 * Current Component Props Import From Global Props Location.
 */
import { IAddUserProp } from "../../../Store/Types"

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
 * This Package Is Used To Generate Unique ID's.
 */
import * as uuid from "uuid"

/**
 * Helper Section's Methods Import.
 * @param createItemParams Insert Data Into Any Custom List Of SharePoint.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { createItemParams, readItemsParams, listTitles } from "../../../helper"

/**
 * Types Declaration Of Current Component States
 */
type IAddUserStates = {
    isActive: boolean
    requester: boolean
    admin: boolean
    validated: boolean
    invalidItems: Array<string>
    usersValues: Array<any>
    selectedUser: any
    showConfirmation: boolean
    saveConfirm: boolean
    userSearchQuery: string
    isLoading: boolean
    isButtonLoading: boolean
    roleOptions: Array<any>
    DefaultroleOptions: Array<any>
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class AddUser extends React.Component<IAddUserProp, IAddUserStates> {
    /**
     * State Initialization.
     */
    public state: IAddUserStates = {
        usersValues: [],
        isActive: true,
        admin: false,
        validated: true,
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        selectedUser: null,
        userSearchQuery: "",
        requester: true,
        isLoading: false,
        isButtonLoading: false,
        roleOptions: [
            { label: "Admin", value: "admin" },
            { label: "Requester", value: "requester" },
        ],
        DefaultroleOptions: [],
    }

    /**
     * React Life Cycle Method
     */
    public componentDidMount() {
        // this.fetchUserEmails();
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        // Destructuring Of States
        const {
            validated,
            invalidItems,
            usersValues,
            admin,
            selectedUser,
            isActive,
            isLoading,
            isButtonLoading,
            roleOptions,
            DefaultroleOptions,
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
                                showSearch
                                allowClear
                                filterOption={false}
                                defaultActiveFirstOption={false}
                                placeholder="Type at least three characters to search"
                                value={selectedUser}
                                onSearch={this.onEmailInputChange}
                                onChange={(value) =>
                                    this.setState({ selectedUser: value })
                                }
                                style={{ width: "100%" }}
                            >
                                {usersValues.map((item, ind) => (
                                    <Select.Option
                                        key={`user-${ind + 1}`}
                                        value={item.value}
                                    >
                                        {item.text}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {/* User Name Section End  */}

                        {/* User Role Selection Section Start */}
                        <Form.Item label="Roles">
                            <Checkbox.Group
                                options={roleOptions}
                                onChange={this.onRoleChange}
                                defaultValue={DefaultroleOptions}
                            />
                        </Form.Item>
                        {/* User Role Selection Section Start */}

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

    private onRoleChange = (checkedValues) => {
        try {
            if (checkedValues.includes("admin")) {
                this.setState({ admin: true })
            } else {
                this.setState({ admin: false })
            }

            if (checkedValues.includes("requester")) {
                this.setState({ requester: true })
            } else {
                this.setState({ requester: false })
            }
        } catch (error) {
            console.error(error)
        }
    }

    //This Method Fetch All Existing User's Email From The User Role Table.
    private fetchUserEmails = async () => {
        try {
            const { httpClient, absUrl } = this.props
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.USER_ROLE_TABLE,
                filters: "$select=Email/EMail&$expand=Email/EMail",
            })

            let response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            let result = await response.json()
            const _usersInSystem = result.value

            // ! I need to know more about this code
            response = await httpClient.get(
                `${absUrl}/_api/web/SiteUsers?$filter=PrincipalType eq 1 and UserPrincipalName ne null`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        Accept: "application/json;odata=nometadata",
                        "odata-version": "",
                    },
                }
            )

            // ! I need to know more about this code
            result = await response.json()
            const _data = result.value.length
                ? result.value
                      .filter(
                          (x) =>
                              !_usersInSystem.some(
                                  (y) => y.Email.EMail === x.Email
                              )
                      )
                      .map((x) => ({
                          text: `${x.Title} - ${x.Email}`,
                          value: x.Id,
                          name: x.Title,
                      }))
                : []
            this.setState({
                usersValues: _data,
            })
        } catch (error) {
            console.error("Error while fetchUserEmails", error)
        }
    }

    /**
     * This Method Fetch All Users From Current Tenant
     * @param userQuery This Query Fiend All Users Which Are In Tenant.
     */
    private fetchUsersFromAD = async (userQuery) => {
        const { httpClient, absUrl } = this.props
        let response = await httpClient.post(
            `${absUrl}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`,
            SPHttpClient.configurations.v1,
            {
                body: JSON.stringify({
                    queryParams: {
                        AllowEmailAddresses: true,
                        AllowMultipleEntities: false,
                        AllUrlZones: false,
                        MaximumEntitySuggestions: 100,
                        PrincipalSource: 15,
                        // PrincipalType controls the type of entities that are returned in the results.
                        // Choices are All - 15, Distribution List - 2 , Security Groups - 4, SharePoint Groups - 8, User - 1.
                        // These values can be combined (example: 13 is security + SP groups + users)
                        PrincipalType: 1,
                        QueryString: userQuery,
                    },
                }),
            }
        )
        let result = await response.json()
        let _persons = JSON.parse(result.value)
        // ! I need to know more about this code
        let _promisePersons = _persons.map((x) => {
            return httpClient.post(
                `${absUrl}/_api/web/ensureUser`,
                SPHttpClient.configurations.v1,
                {
                    body: JSON.stringify({
                        logonName: x.Key,
                    }),
                }
            )
        })

        let responseArr: SPHttpClientResponse[] = await Promise.all(
            _promisePersons
        )
        const _usersInTenant = await Promise.all(
            responseArr.map((x) => x.json())
        )

        const params = readItemsParams({
            absoluteUrl: absUrl,
            listTitle: listTitles.USER_ROLE_TABLE,
            filters: "$select=Email/EMail&$expand=Email/EMail",
        })

        // ! I need to know more about this code
        response = await httpClient.get(
            params.url,
            params.config,
            params.options
        )
        result = await response.json()
        const _usersInSystem = result.value
        const _data = _usersInTenant.length
            ? _usersInTenant
                  .filter(
                      (x) =>
                          !_usersInSystem.some((y) => y.Email.EMail === x.Email)
                  )
                  .map((x) => ({
                      text: `${x.Title} - ${x.Email}`,
                      value: x.Id,
                      name: x.Title,
                  }))
            : []
        this.setState({
            usersValues: _data,
        })
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

    /**
     * This Method Check That User Must enter Minimum 3 Character Then Search Funtion Can Be Called
     */
    private onEmailInputChange = (searchText: string) => {
        searchText.length > 2 && this.fetchUsersFromAD(searchText)
    }

    // On form submit - on Save button click
    private handleSubmit = async () => {
        try {
            const { admin, selectedUser, requester } = this.state

            if (selectedUser === "") {
                message.info("Invalid Entries. Please Enter User Name")
            } else if (!requester || !admin) {
                message.info("Please check at least one from the Rights.")
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.saveUser()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * ! I Need to Check Fields Of SharePoint List
     * This Method As Name Suggest Store Data Into SharePoint Custom List
     */
    private saveUser = async () => {
        const { selectedUser, isActive, usersValues } = this.state
        const { absUrl } = this.props
        const { url, config, options } = createItemParams({
            absoluteUrl: absUrl,
            listTitle: listTitles.USER_ROLE_TABLE,
            body: {
                __metadata: { type: "SP.Data.UserRolesTableListItem" },
                FirstName: usersValues.find(
                    (user) => user.value == selectedUser
                ).name,
                EmailId: selectedUser,
                Rights: this.rightsToString(),
                uuid: uuid.v4(),
                isActive: isActive,
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
                      },
                      () => {
                          message.success("User Inserted Successfully")
                          this.props.history.push("/admin/users")
                      }
                  )
                : this.setState({ isButtonLoading: false }, () => {
                      message.error("Something Is Wrong!!! Try Again Latter")
                  })

            // if (result.status == 200) {
            //     this.setState({ isButtonLoading: false }, () => {
            //         message.success("User Inserted Successfully")
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
     * This Method Close Confirmation Box.
     * !We Need to delete this code
     */
    // closeConfirmationDialog = () => this.setState({ showConfirmation: false });

    /**
     * This Method Close Success Message Box.
     *  !We Need to delete this code
     */
    // closeSaveConfirmDialog = () => {
    //   this.setState({ saveConfirm: false });
    //   this.props.history.push("/admin/users");
    // };

    // Click event for Cancel button on form
    private onCancelClick = () => {
        this.props.history.push("/admin/users")
    }

    // Click event for Yes button on confirmation dialog box
    //  !We Need to delete this code
    // onSaveConfirm = () => {
    //   this.saveUser().then(() => {
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
export default connect(mapStateToProps)(AddUser)
