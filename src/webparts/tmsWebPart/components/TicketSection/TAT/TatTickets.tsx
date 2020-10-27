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
 * Library For Date Format Modifications.
 */
import * as dayjs from "dayjs"

/**
 * This Library Used To Create Excel File From Given Data And Download That Excel File
 *
 */
import * as Exceljs from "exceljs"
import * as FileSaver from "file-saver"

/**
 * Current Component Props Import From Global Props Location.
 */
import { ITatTicketsProp } from "../../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import { Table, Row, Col, Input, Button, Space, Spin, Layout } from "antd"
import { Link } from "react-router-dom"

/**
 * Ant Design Icons Import
 */
import { EditOutlined, DownloadOutlined } from "@ant-design/icons"

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
    sr?: number
    ticketNo?: string
    ticketTitle?: string
    customerName?: string
    productName?: string
    priority?: string
    assignedTo?: string
    createdBy?: string
    dueDate?: string
    ticketStatus?: string
    actions?: any
}

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type ITatTicketsState = {
    rowData: Array<TicketCols>
    columns: Array<any>
    searchTicket: string
    isLoading: boolean
    downloadData: Array<any>
}

/**
 * Main Class Of Component.
 */
class InTatTickets extends React.Component<ITatTicketsProp, ITatTicketsState> {
    /**
     * State Initialization.
     */
    public state: ITatTicketsState = {
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
                render: (text, record) => {
                    return (
                        <Space size="middle">
                            <Link to={`/edit-ticket/${record.actions}`}>
                                <Button
                                    shape="circle"
                                    type="link"
                                    /*@ts-ignore*/
                                    icon={<EditOutlined />}
                                />
                            </Link>
                        </Space>
                    )
                },
            } as any,
        ],
        rowData: [],
        searchTicket: "",
        isLoading: false,
        downloadData: [],
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch All Customer Details.
     */
    public componentDidMount() {
        this.fetchInProgressTickets()
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        const { columns, rowData, searchTicket, isLoading } = this.state
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
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={this.downloadTatTickets}
                                        size="middle"
                                        /*@ts-ignore*/ icon={
                                            <DownloadOutlined />
                                        }
                                    >
                                        Download
                                    </Button>
                                </Col>
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
                                            onClick={
                                                this.fetchInProgressTickets
                                            }
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

    private fetchInProgressTickets = async () => {
        try {
            this.setState({ isLoading: true })
            const { absUrl, httpClient } = this.props
            // let customfilter = this.customSearch()
            let customfilter = ""
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.TICKET_INFORMATION_TABLE,
                filters: `$select=*,Author/Title,Editor/Title,CustomerDetails/CustomerName,AssignedTo/Title,ProductId/ProductName,StatusId/StatusTypeName&$expand=Author,Editor,CustomerDetails,AssignedTo,ProductId,StatusId${customfilter}&$orderby=Modified desc`,
            })
            const response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            const result = await response.json()

            let downloadResult = result.value.length
                ? result.value.map((x: any, ind: number) => ({
                      SR: ind + 1,
                      TicketNo: x.TicketNo,
                      TicketTitle: x.Title,
                      CustomerName: x?.CustomerDetails?.CustomerName,
                      ProductName: x?.ProductId?.ProductName,
                      Priority: x.TicketPriority,
                      AssignedTo: x?.AssignedTo?.Title,
                      CreatedBy: x.Author.Title,
                      DueDate: dayjs(x.TicketDueDate).format("MM-DD-YYYY"),
                      createdDate: dayjs(x.Created).format("MM-DD-YYYY"),
                      TicketStatus: x?.StatusId?.StatusTypeName,
                  }))
                : ""
            this.setState({ downloadData: downloadResult })
            const _data: Array<TicketCols> = result.value.length
                ? result.value.map(
                      (x: any, ind: number) =>
                          ({
                              sr: ind + 1,
                              ticketNo: x.TicketNo,
                              ticketTitle: x.Title,
                              customerName: x?.CustomerDetails?.CustomerName,
                              productName: x?.ProductId?.ProductName,
                              priority: x.TicketPriority,
                              assignedTo: x?.AssignedTo?.Title,
                              createdBy: x.Author.Title,
                              dueDate: dayjs(x.TicketDueDate).format(
                                  "MM-DD-YYYY"
                              ),
                              ticketStatus: x?.StatusId?.StatusTypeName,
                              actions: x.Id,
                          } as TicketCols)
                  )
                : []
            this.setState({ rowData: _data, isLoading: false })
        } catch (error) {
            console.error("Error while fetchInProgressTickets", error)
        }
    }

    /**
     * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
     */
    private customSearch = () => {
        try {
            let { searchTicket } = this.state

            let filterVariable: string = `&$filter=StatusIdId eq 1`

            if (searchTicket) {
                filterVariable = `and (TicketNo eq '${searchTicket}' or Title eq '${searchTicket}' or TicketPriority eq '${searchTicket}' or CustomerDetails/CustomerName eq '${searchTicket}' or AssignedTo/Title eq '${searchTicket}' or ProductId/ProductName eq '${searchTicket}' or StatusId/StatusTypeName eq '${searchTicket}' )`
            } else {
                filterVariable = `&$filter=StatusIdId eq 1`
            }
            return filterVariable
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Export  Data Into Excel File.
     * ! We Need To Put Validation For Download. (Range Validation)
     */
    downloadTatTickets = async () => {
        try {
            let datarows = this.state.downloadData
            var workbook = new Exceljs.Workbook()
            //create new sheet in workbook
            var sheet = workbook.addWorksheet("Export Data")

            let columns = [
                { header: "Sr", key: "SR", width: 5 },
                { header: "Ticket No", key: "TicketNo", width: 26 },
                { header: "Ticket Title", key: "TicketTitle", width: 26 },
                { header: "Customer Name", key: "CustomerName", width: 26 },
                { header: "Product Name", key: "ProductName", width: 26 },
                { header: "Priority", key: "Priority", width: 26 },
                { header: "Assigned To", key: "AssignedTo", width: 26 },
                { header: "Created By", key: "CreatedBy", width: 26 },
                { header: "Due Date", key: "DueDate", width: 26 },
                {
                    header: "Ticket Status",
                    key: "TicketStatus",
                    width: 26,
                },
            ]

            sheet.columns = columns
            sheet.addRows(datarows)

            //export woekbook into buffer
            workbook.xlsx.writeBuffer().then((buffer) => {
                //Download buffer as file using FileSaver
                FileSaver.saveAs(
                    new Blob([buffer]),
                    `TAT_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
                )
            })
        } catch (error) {
            console.error(error)
        }
    }
}

/**
 * Redux Map Funtion Which Map Global Store's State To Props Of Current Component.
 */
const mapStateToProps = (state) => ({
    absUrl: state.dashboard.absoluteUrl,
    httpClient: state.dashboard.httpClient,
    user: state.login.user,
})

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(InTatTickets)
