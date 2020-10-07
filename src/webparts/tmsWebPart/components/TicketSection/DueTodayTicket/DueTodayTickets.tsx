/**
 * React Package Import
 */
import * as React from "react"

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
 * Library For Date Format Modifications.
 */
import * as dayjs from "dayjs"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IDueTodaysTicketsProp } from "../../../Store/Types"

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
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemsParams, listTitles } from "../../../helper"

/**
 * This Code Block Is Type Declaration Of DataTable
 */
type TicketCols = {
    sr?: Number
    ticketNo?: String
    ticketTitle?: String
    customerName?: String
    productName?: String
    priority?: String
    assignedTo?: String
    createdBy?: String
    dueDate?: String
    ticketStatus?: String
    actions?: any
}

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type IDueTodaysTicketsState = {
    rowData: Array<TicketCols>
    columns: Array<any>
    currentdate: any
    searchTicket: string
    isLoading: boolean
}

/**
 * Main Class Of Component.
 */
class DueTodaysTickets extends React.Component<
    IDueTodaysTicketsProp,
    IDueTodaysTicketsState
> {
    /**
     * State Initialization.
     */
    public state: IDueTodaysTicketsState = {
        columns: [
            { title: "Sr#", dataIndex: "sr", key: "sr" },
            {
                title: "Ticket No.",
                dataIndex: "ticketNo",
                key: "ticketNo",
            },
            {
                title: "Ticket Title",
                dataIndex: "ticketTitle",
                key: "ticketTitle",
            },
            {
                title: "Customer Name",
                dataIndex: "customerName",
                key: "customerName",
            },
            {
                title: "Product Name",
                dataIndex: "productName",
                key: "productName",
            },
            {
                title: "Priority",
                dataIndex: "priority",
                key: "priority",
            },
            {
                title: "Assigned To",
                dataIndex: "assignedTo",
                key: "assignedTo",
            },
            {
                title: "Created By",
                dataIndex: "createdBy",
                key: "createdBy",
            },
            {
                title: "Due Date",
                dataIndex: "dueDate",
                key: "dueDate",
            },
            {
                title: "Ticket Status",
                dataIndex: "ticketStatus",
                key: "ticketStatus",
            },
            {
                title: "Actions",
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
        currentdate: dayjs().format("YYYY-MM-DD").toString(),
        searchTicket: "",
        isLoading: false,
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch All Customer Details.
     */
    public componentDidMount() {
        this.fetchDueTodaysTickets()
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        const { columns, rowData, isLoading, searchTicket } = this.state
        return (
            <>
                <Spin spinning={isLoading}>
                    <Layout
                        style={{
                            backgroundColor: "white",
                        }}
                    >
                        <Layout.Content style={{ marginTop: "3em" }}>
                            <Row>
                                {/* <Col span={12}>
                                    <Button type="primary" size="middle">
                                        Add Ticket
                                    </Button>
                                </Col> */}
                                <Col span={12}>
                                    <Space>
                                        <Input
                                            placeholder="Search Tickets"
                                            value={searchTicket}
                                            onChange={(e) => {
                                                this.setState({
                                                    searchTicket:
                                                        e.target.value,
                                                })
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            /*@ts-ignore*/
                                            icon={<EditOutlined />}
                                            size="middle"
                                            onClick={this.fetchDueTodaysTickets}
                                        >
                                            Search
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
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
                        </Layout.Content>
                    </Layout>
                </Spin>
            </>
        )
    }

    private fetchDueTodaysTickets = async () => {
        const { absUrl, httpClient } = this.props
        let { currentdate, isLoading } = this.state
        this.setState({ isLoading: true }, async () => {
            try {
                let customfilter = this.customSearch()
                const params = readItemsParams({
                    absoluteUrl: absUrl,
                    listTitle: listTitles.TICKET_INFORMATION_TABLE,
                    filters: `$select=*,Author/Title,Editor/Title,CustomerDetails/CustomerName,AssignedTo/Title,ProductId/ProductName,StatusId/StatusTypeName&$expand=Author,Editor,CustomerDetails,AssignedTo,ProductId,StatusId&$filter=TicketDueDate eq '${currentdate}' ${customfilter}&$orderby=Modified desc`,
                })

                const response = await httpClient.get(
                    params.url,
                    params.config,
                    params.options
                )
                const result = await response.json()
                const _data: Array<TicketCols> = result.value.length
                    ? result.value.map(
                          (x: any, ind: number) =>
                              ({
                                  sr: ind + 1,
                                  ticketNo: x.TicketNo,
                                  ticketTitle: x.Title,
                                  customerName: x.CustomerDetails.CustomerName,
                                  productName: x.ProductId.ProductName,
                                  priority: x.TicketPriority,
                                  assignedTo: x.AssignedTo.Title,
                                  createdBy: x.Author.Title,
                                  dueDate: dayjs(x.TicketDueDate).format(
                                      "MM-DD-YYYY"
                                  ),
                                  ticketStatus: x.StatusId.StatusTypeName,
                                  actions: x.Id,
                              } as TicketCols)
                      )
                    : []
                this.setState({ rowData: _data, isLoading: false })
            } catch (error) {
                console.error("Error while fetch Due Todays Tickets", error)
            }
        })
    }

    /**
     * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
     */
    private customSearch = () => {
        try {
            let { searchTicket } = this.state

            let filterVariable: string = ``

            if (searchTicket) {
                filterVariable += `and (TicketNo eq '${searchTicket}' or Title eq '${searchTicket}' or TicketPriority eq '${searchTicket}' or CustomerDetails/CustomerName eq '${searchTicket}' or AssignedTo/Title eq '${searchTicket}' or ProductId/ProductName eq '${searchTicket}' or StatusId/StatusTypeName eq '${searchTicket}' )`
            } else {
                filterVariable = ``
            }
            return filterVariable
        } catch (error) {
            console.error(error)
        }
    }

    private goToEditTicket = (value) => {
        try {
            this.props.history.push({
                pathname: `/edit-ticket/${value}`,
                state: {
                    ticketId: value,
                },
            })
        } catch (error) {
            console.error("Error while goToEditTicket", error)
        }
    }
}

const mapStateToProps = (state) => ({
    absUrl: state.dashboard.absoluteUrl,
    httpClient: state.dashboard.httpClient,
    user: state.login.user,
})

export default connect(mapStateToProps)(DueTodaysTickets)
