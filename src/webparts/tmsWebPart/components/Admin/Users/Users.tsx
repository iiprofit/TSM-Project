/**
 * React Package Import
 */
import * as React from "react"

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IUsersProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Table, Row, Col, Input, Button, Space, Spin, Layout } from "antd"

/**
 * Ant Design Icons Import
 */
import { EditOutlined } from "@ant-design/icons"

/**
 * Helper Section's Methods Import.
 * @param rightsToBoolean Convert Multiple Boolean Values Into Single String. (This is Used For User Rights)
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemsParams, listTitles, rightsToBoolean } from "../../../helper"

/**
 * This Code Block Is Type Declaration Of DataTable
 */
type UserCols = {
    sr?: Number
    userName?: String
    email?: String
    requester?: String
    admin?: String
    actions?: any
    isActive?: String
}

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type IUsersState = {
    columns: Array<any>
    rowData: Array<UserCols>
    userSearch: string
    isLoading: boolean
}

/**
 * Main Class Of Component.
 */
class Users extends React.Component<IUsersProp, IUsersState> {
    /**
     * State Initialization.
     */
    public state: IUsersState = {
        columns: [
            { title: "Sr#", dataIndex: "sr", key: "sr" },
            { title: "User Name", dataIndex: "userName", key: "userName" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Requester", dataIndex: "requester", key: "requester" },
            { title: "Admin", dataIndex: "admin", key: "admin" },
            { title: "Is Active", dataIndex: "isActive", key: "isactive" },
            {
                title: "Action",
                dataIndex: "actions",
                key: "actions",
                render: (text, record) => (
                    <Space size="middle">
                        <Button
                            shape="circle"
                            type="link"
                            /*@ts-ignore*/
                            icon={<EditOutlined />}
                            onClick={() => console.log(record)}
                        />
                    </Space>
                ),
            } as any,
        ],
        rowData: [],
        userSearch: "",
        isLoading: false,
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Set Roles Values In DataTable based on Users Rigjts.
     */
    public componentDidMount() {
        this.fetchUsers()
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement<IUsersProp> {
        const { columns, rowData, userSearch, isLoading } = this.state
        return (
            <>
                {/* Spin Component Is Used For Loading Process */}
                {/* We Need To impliment Is loading In Spin */}
                <Spin spinning={isLoading}>
                    <Layout
                        style={{
                            backgroundColor: "white",
                        }}
                    >
                        <Layout.Content style={{ marginTop: "3em" }}>
                            <Row>
                                {/* Add Customer Button Section Start */}
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        /*@ts-ignore*/
                                        size="middle"
                                    >
                                        Add Customer
                                    </Button>
                                </Col>
                                {/* Add Customer Button Section End */}

                                {/* Search Customer  Section Start */}
                                <Col span={12}>
                                    <Space>
                                        <Input
                                            placeholder="Search Users"
                                            value={userSearch}
                                            onChange={(e) => {
                                                this.setState({
                                                    userSearch: e.target.value,
                                                })
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            /*@ts-ignore*/
                                            icon={<EditOutlined />}
                                            size="middle"
                                            onClick={this.fetchUsers}
                                        >
                                            Search
                                        </Button>
                                    </Space>
                                </Col>
                                {/* Search Customer  Section End */}
                            </Row>

                            {/* Customer Data Display  Section Start */}
                            <Row>
                                <Col span={24}>
                                    <Table
                                        columns={columns}
                                        dataSource={rowData}
                                        scroll={{ y: 550 }}
                                        size="small"
                                    ></Table>
                                </Col>
                            </Row>
                            {/* Customer Data Display  Section End */}
                        </Layout.Content>
                    </Layout>
                </Spin>
            </>
        )
    }

    /**
     * This Method Fetch All The Data Of Users For DataTable
     */
    private fetchUsers = async () => {
        const { httpClient, absUrl } = this.props
        this.setState({ isLoading: true }, async () => {
            try {
                let customfilter = this.customSearch()
                const param = readItemsParams({
                    absoluteUrl: absUrl,
                    listTitle: listTitles.USER_ROLE_TABLE,
                    filters: `$select=*,Email/EMail&$expand=Email/EMail${customfilter}`,
                })
                httpClient
                    .get(param.url, param.config, param.options)
                    .then((response) => response.json())
                    .then((result) => {
                        const _data = result.value
                        let _users: Array<UserCols>
                        _users = _data.length
                            ? _data.map((x, ind) => {
                                  let rights = rightsToBoolean(x.Rights)
                                  return {
                                      sr: ind + 1,
                                      userName: x.FirstName,
                                      actions: x.Id,
                                      email: x.Email.EMail,
                                      admin: rights.admin ? "Yes" : "No",
                                      requester: rights.approve ? "Yes" : "No",
                                      isActive: x.IsActive ? "Yes" : "No",
                                  } as UserCols
                              })
                            : []
                        this.setState({ rowData: _users, isLoading: false })
                    })
                    .then(() => {})
                    .catch((err) => console.error(err))
            } catch (error) {
                console.error(error)
            }
        })
    }

    /**
     * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
     */
    private customSearch = () => {
        try {
            let { userSearch } = this.state
            let filterVariable: string = ""
            if (userSearch) {
                filterVariable =
                    "&$filter=FirstName eq" +
                    userSearch +
                    "or Email/EMail eq" +
                    userSearch
            } else {
                filterVariable = ""
            }
            return filterVariable
        } catch (error) {
            console.error(error)
        }
    }
    /**
     * This Method Re-Direct Admin to Edit User Page With ID
     * @param value This Is Id Of User's Which Data Admin Wants To Edit
     */
    private goToEditUser = (value) => {
        this.props.history.push({
            pathname: `/edit-user/${value}`,
            state: {
                userId: value,
            },
        })
    }
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
export default connect(mapStateToProps)(Users)
