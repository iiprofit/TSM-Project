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
 * React Router Packge Import.
 * @Link is used to Re-direct user to another section.
 */
import { Link } from "react-router-dom"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IStatusTypeProp } from "../../../Store/Types"

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
import { readItemsParams, listTitles } from "../../../helper"

/**
 * This Code Block Is Type Declaration Of DataTable
 */
type StatusTypeCols = {
    sr?: Number
    statusTypeName?: String
    isActive?: String
    actions?: any
}

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type IStatusTypeState = {
    rowData: Array<StatusTypeCols>
    columns: Array<any>
    statusTypeSearch: string
    isLoading: boolean
}

/**
 * Main Class Of Component.
 */
class StatusType extends React.Component<IStatusTypeProp, IStatusTypeState> {
    /**
     * State Initialization.
     */
    public state: IStatusTypeState = {
        columns: [
            { title: "Sr#", dataIndex: "sr", key: "sr" },
            {
                title: "Status Name",
                dataIndex: "statusTypeName",
                key: "statusTypeName",
            },
            {
                title: "isActive",
                dataIndex: "isActive",
                key: "isActive",
            },
            {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                render: (text, record) => {
                    return (
                        <Space size="middle">
                            <Link to={`/edit-status/${record.actions}`}>
                                <Button
                                    shape="circle"
                                    type="link"
                                    /*@ts-ignore*/
                                    icon={<EditOutlined />}
                                    onClick={() => console.log(record)}
                                />
                            </Link>
                        </Space>
                    )
                },
            } as any,
        ],
        rowData: [],
        statusTypeSearch: "",
        isLoading: false,
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch All Status Type Details.
     */
    public componentDidMount() {
        this.fetchStatusTypeItems()
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        const { columns, rowData, statusTypeSearch, isLoading } = this.state
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
                                {/* Add Status Button Section Start */}
                                <Col span={12}>
                                    <Link to="/new-status">
                                        <Button
                                            type="primary"
                                            /*@ts-ignore*/
                                            size="middle"
                                        >
                                            Add Status Type
                                        </Button>
                                    </Link>
                                </Col>
                                {/* Add Status Type Button Section Start */}

                                {/* Search Status Type  Section Start */}
                                <Col span={12}>
                                    <Space>
                                        <Input
                                            placeholder="Search Status Types"
                                            value={statusTypeSearch}
                                            onChange={(e) => {
                                                this.setState({
                                                    statusTypeSearch:
                                                        e.target.value,
                                                })
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            /*@ts-ignore*/
                                            icon={<EditOutlined />}
                                            size="middle"
                                            onClick={this.fetchStatusTypeItems}
                                        >
                                            Search
                                        </Button>
                                    </Space>
                                </Col>
                                {/* Search Statys Type  Section Start */}
                            </Row>

                            {/* Status Type Data Display  Section Start */}
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
                            {/* Status Type Data Display  Section End */}
                        </Layout.Content>
                    </Layout>
                </Spin>
            </>
        )
    }

    /**
     * This Method Fetch All The Data Of Status Types For DataTable
     */
    private fetchStatusTypeItems = async () => {
        const { absUrl, httpClient } = this.props
        this.setState({ isLoading: true }, async () => {
            try {
                let customfilter = this.customSearch()
                const params = readItemsParams({
                    absoluteUrl: absUrl,
                    listTitle: listTitles.STATUS_TYPE,
                    filters: `${customfilter}`,
                })
                const response = await httpClient.get(
                    params.url,
                    params.config,
                    params.options
                )
                const result = await response.json()
                const _data: Array<StatusTypeCols> = result.value.length
                    ? result.value.map(
                          (x: any, ind: number) =>
                              ({
                                  sr: ind + 1,
                                  statusTypeName: x.StatusTypeName,
                                  isActive: x.isActive ? "Yes" : "No",
                                  actions: x.Id,
                              } as StatusTypeCols)
                      )
                    : []
                this.setState({ rowData: _data, isLoading: false })
            } catch (error) {
                console.error("Error while Fetch All Status Type", error)
            }
        })
    }

    /**
     * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
     */
    private customSearch = () => {
        try {
            let { statusTypeSearch } = this.state

            let filterVariable: string = ""

            if (statusTypeSearch) {
                filterVariable = "$filter=StatusTypeName eq" + statusTypeSearch
            } else {
                filterVariable = ""
            }
            return filterVariable
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Re-Direct Admin to Edit Status Type Page With ID
     * @param value This Is Id Of Status Type's Which Data Admin Wants To Edit
     */
    private goToEditStatusType = (value) => {
        this.props.history.push({
            pathname: `/edit-status/${value}`,
            state: {
                statusId: value,
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
export default connect(mapStateToProps)(StatusType)
