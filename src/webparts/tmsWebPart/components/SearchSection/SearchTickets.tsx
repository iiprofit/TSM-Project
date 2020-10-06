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
 * This is Time Formating Library
 */

import * as moment from "moment"

/**
 * Current Component Props Import From Global Props Location.
 */
import { ISearchTicketsProp } from "../../Store/Types"

/**
 * Ant Deisgn Component Imports
 */
import {
    Table,
    Row,
    Col,
    Button,
    Select,
    Spin,
    DatePicker,
    Layout,
    Form,
} from "antd"

/**
 * Ant Design Icons Import
 */
import { EditOutlined } from "@ant-design/icons"

// This Options Component Is Used With Select Component.
const { Option } = Select

/**
 * Helper Section's Methods Import.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemsParams, listTitles } from "../../helper"

/**
 * This Library Used To Create Excel File From Given Data And Download That Excel File
 *
 */
import * as Exceljs from "exceljs"
import * as FileSaver from "file-saver"

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
 */
type ISearchTicketsState = {
    rowData: Array<TicketCols>
    columns: Array<any>
    currentdate?: Date
    startDate?: moment.Moment
    endDate?: moment.Moment
    srchStatusType?: Array<any>
    srchStatusTypeSelected?: number
    srchPriority?: Array<any>
    srchPrioritySelected?: Array<any>
    srchAssignedToSelected?: Array<any>
    srchAssignedTo?: Array<any>
    srchCustomer?: Array<any>
    srchCustomerSelected?: Array<any>
    allUserData?: Array<any>
    invaliddate?: Date
    downloadData?: Array<any>
    isLoading: boolean
}

/**
 * Main Class Of Component.
 */
class SearchTickets extends React.Component<
    ISearchTicketsProp,
    ISearchTicketsState
> {
    /**
     * State Initialization.
     */
    public state: ISearchTicketsState = {
        columns: [
            { title: "Sr#", dataIndex: "sr", key: "sr" },
            {
                title: "Ticket Title",
                dataIndex: "ticketTitle",
                key: "ticketTitle",
            },
            {
                title: "Ticket No.",
                dataIndex: "ticketNo",
                key: "ticketNo",
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
                title: "Ticket Priority",
                dataIndex: "priority",
                key: "priority",
            },
            {
                title: "Assigned To",
                dataIndex: "assignedTo",
                key: "assignedTo",
            },
            {
                title: "Due Date",
                dataIndex: "dueDate",
                key: "dueDate",
            },
            ,
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
                    ;<Button
                        shape="circle"
                        type="link"
                        /*@ts-ignore*/
                        icon={<EditOutlined />}
                        onClick={() => console.log(record)}
                    />
                },
            } as any,
        ],
        rowData: [],
        currentdate: new Date(),
        endDate: null,
        startDate: null,
        srchAssignedTo: [],
        srchCustomer: [],
        srchPriority: [
            { value: "High", text: "High" },
            { value: "Medium", text: "Medium" },
            { value: "Low", text: "Low" },
            { value: "None", text: "None" },
        ],
        srchPrioritySelected: [],
        srchStatusTypeSelected: null,
        srchAssignedToSelected: [],
        srchCustomerSelected: [],
        srchStatusType: [],
        allUserData: [],
        invaliddate: null,
        downloadData: [],
        isLoading: false,
    }

    /**
     * React Life Cycle Method
     * This Method Also Called Funtion Which Fetch All Fields Details Details.
     * @fetchSearchResult This Method By Default Fetch All Tickets.
     * @onRequestereFetch This Method Fetch All Users Who Have Requester Permission.
     * @onFetchTypes This Method Fetch All Ticket Status Types.
     * @onFetchCustomer This Method Fetch All Customers
     */
    public componentDidMount() {
        this.setState({ isLoading: true })
        this.fetchSearchResult()
        this.onSearchParamsFetch().then(() => {
            this.onRequestereFetch()
            this.onFetchTypes()
            this.onFetchCustomer().then(() => {
                this.setState({ isLoading: false })
            })
        })
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        //Destructuring Of States
        const {
            columns,
            rowData,
            endDate,
            startDate,
            srchAssignedTo,
            srchCustomer,
            srchPriority,
            srchPrioritySelected,
            srchStatusType,
            srchStatusTypeSelected,
            srchAssignedToSelected,
            srchCustomerSelected,
            isLoading,
        } = this.state
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
                                {/* Start Date Selection Section Start */}
                                <Col span={13}>
                                    <Form.Item label="Start Date">
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="MM-DD-YYYY"
                                            value={startDate}
                                            onChange={(value) =>
                                                this.setState({
                                                    startDate: moment(value),
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                {/* Start Date Selection Section End */}

                                {/* End Date Selection Section Start */}
                                <Col span={13}>
                                    <Form.Item label="End Date">
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="MM-DD-YYYY"
                                            value={endDate}
                                            onChange={(value) =>
                                                this.setState({
                                                    endDate: moment(value),
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                {/* End Date Selection Section End */}

                                {/* Ticket Status Type Selection Section Start */}
                                <Col span={12}>
                                    <Form.Item label="Select Status Type">
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            value={srchStatusTypeSelected}
                                            optionFilterProp="children"
                                            onChange={(value) =>
                                                this.setState({
                                                    srchStatusTypeSelected: value,
                                                })
                                            }
                                        >
                                            {srchStatusType &&
                                                srchStatusType.map((items) => (
                                                    <Option value={items.value}>
                                                        {items.text}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Ticket Status Type Selection Section End */}

                                {/* Ticket Priority Selection Section Start */}
                                <Col span={12}>
                                    <Form.Item label="Select Priority">
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Select Priority"
                                            value={srchPrioritySelected}
                                            optionFilterProp="children"
                                            onChange={(value) =>
                                                this.setState({
                                                    srchPrioritySelected: value,
                                                })
                                            }
                                        >
                                            {srchPriority &&
                                                srchPriority.map((items) => (
                                                    <Option value={items.value}>
                                                        {items.text}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Ticket Priority Type Selection Section End */}

                                {/* Ticket AssignedTo Selection Section Start */}
                                <Col span={12}>
                                    <Form.Item label="Select Assigned To">
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            value={srchAssignedToSelected}
                                            optionFilterProp="children"
                                            onChange={(value) =>
                                                this.setState({
                                                    srchAssignedToSelected: value,
                                                })
                                            }
                                        >
                                            {srchAssignedTo &&
                                                srchAssignedTo.map((items) => (
                                                    <Option value={items.value}>
                                                        {items.text}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Ticket AssignedTo Selection Section End */}

                                {/* Customer Selection Section Start */}
                                <Col span={12}>
                                    <Form.Item label="Select Customer">
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            value={srchCustomerSelected}
                                            optionFilterProp="children"
                                            onChange={(value) => {
                                                // console.log(value);
                                                this.setState({
                                                    srchCustomerSelected: value,
                                                })
                                            }}
                                        >
                                            {srchCustomer &&
                                                srchCustomer.map((items) => (
                                                    <Option value={items.text}>
                                                        {items.text}
                                                    </Option>
                                                ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {/* Customer Selection Section End */}

                                {/* Search Section Start */}
                                <Col span={8}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            onClick={this.fetchSearchResult}
                                        >
                                            Search
                                        </Button>
                                    </Form.Item>
                                </Col>
                                {/* Search Section End */}

                                {/* Reset Section Start */}
                                <Col span={8}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            onClick={this.resetAll}
                                        >
                                            Reset
                                        </Button>
                                    </Form.Item>
                                </Col>
                                {/* Reset Section End */}

                                {/* Download Section Start */}
                                <Col span={8}>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            onClick={this.downloadSearchResult}
                                        >
                                            Download Result
                                        </Button>
                                    </Form.Item>
                                </Col>
                                {/* Download Section End */}
                            </Row>
                            <Row>
                                {/* Data Table Section Start */}
                                <Col span={24}>
                                    <Table
                                        columns={columns}
                                        dataSource={rowData}
                                        scroll={{ y: 550 }}
                                        size="small"
                                    ></Table>
                                </Col>
                                {/* Data Table Section End */}
                            </Row>
                        </Layout.Content>
                    </Layout>
                </Spin>
            </>
        )
    }

    /**
     * Reset Funtion
     */

    resetAll = () => {
        try {
            this.setState({
                srchStatusTypeSelected: null,
                srchCustomerSelected: [],
            })
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Fetch all Users From USer Table So We Can Used Them In Future.
     */
    onSearchParamsFetch = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.USER_ROLE_TABLE,
                filters: "$select=*,Email/EMail&$expand=Email/EMail",
            })

            let response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            let result = await response.json()
            this.setState({
                allUserData: result.value,
            })
        } catch (error) {
            console.error("Error while onSearchParamsFetch", error)
        }
    }

    /**
     * This Method Fetch All Requesters And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    onRequestereFetch = async () => {
        try {
            let { allUserData } = this.state
            let tempRequesterValue = await allUserData.filter((users) => {
                return users.Rights.includes("requester")
            })
            // console.log("Requester Fetch Log");
            // console.log(allUserData);
            let _result = tempRequesterValue.map((x: any, ind: number) => {
                return {
                    value: x.EmailId ? x.EmailId : "",
                    text: x.FirstName ? x.FirstName : "",
                }
            })
            this.setState({ srchAssignedTo: _result })
        } catch (error) {
            console.error("Error while On Requester Fetch", error)
        }
    }

    /**
     * This Method Fetch All Customers And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    onFetchCustomer = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.CUSTOMER_INFORMATION,
                filters: "",
            })

            let response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            let result = await response.json()
            let _result = await result.value.map((x: any, ind: number) => {
                return {
                    value: x.CustomerEmail ? x.CustomerEmail : "",
                    text: x.CustomerName ? x.CustomerName : "",
                }
            })
            this.setState({
                srchCustomer: _result,
            })
        } catch (error) {
            console.error("Error while on fetch customer seciton", error)
        }
    }

    /**
     * This Method Fetch All Status Types And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    onFetchTypes = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const { srchStatusType } = this.state
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.STATUS_TYPE,
                filters: "",
            })

            let response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            let result = await response.json()
            let _result = await result.value.map((x: any, ind: number) => {
                return {
                    value: x.Id ? x.Id : "",
                    text: x.StatusTypeName ? x.StatusTypeName : "",
                }
            })
            this.setState({
                srchStatusType: _result,
            })
        } catch (error) {
            console.error("Error while On Fetch Status Type", error)
        }
    }

    /**
     * This Method Is Used To Create Custom Search URL For REST API Call.
     */
    private customSearch = () => {
        try {
            // console.log(this.state.srchCustomerSelected);
            const { absUrl, httpClient } = this.props
            let filterVariable: string

            let {
                invaliddate,
                startDate,
                endDate,
                srchAssignedToSelected,
                srchCustomerSelected,
                srchPrioritySelected,
                srchStatusTypeSelected,
            } = this.state
            // console.log(srchStatusTypeSelected);
            let tempstartdate = startDate.format("YYYY-MM-DD").toString()
            let tempenddate = endDate.format("YYYY-MM-DD").toString()

            if (
                srchAssignedToSelected.length ||
                srchCustomerSelected.length ||
                srchPrioritySelected.length ||
                srchStatusTypeSelected ||
                !invaliddate
            ) {
                filterVariable = "&$filter="
            } else {
                filterVariable = ""
            }

            if (filterVariable) {
                if (srchAssignedToSelected.length) {
                    filterVariable === "&$filter="
                        ? (filterVariable += `(AssignedToId eq '${srchAssignedToSelected[0].value}')`)
                        : (filterVariable += ` and (AssignedToId eq '${srchAssignedToSelected[0].value}')`)
                }
                if (srchCustomerSelected.length) {
                    filterVariable === "&$filter="
                        ? (filterVariable += `(CustomerDetails/CustomerName eq '${srchCustomerSelected}')`)
                        : (filterVariable += ` and (CustomerDetails/CustomerName eq '${srchCustomerSelected}')`)
                }
                if (srchPrioritySelected.length) {
                    filterVariable === "&$filter="
                        ? (filterVariable += `(TicketPriority eq '${srchPrioritySelected[0].value}')`)
                        : (filterVariable += ` and (TicketPriority eq '${srchPrioritySelected[0].value}')`)
                }
                if (srchStatusTypeSelected) {
                    filterVariable === "&$filter="
                        ? (filterVariable += `(StatusId eq '${srchStatusTypeSelected}')`)
                        : (filterVariable += ` and (StatusId eq '${srchStatusTypeSelected}')`)
                }
                if (
                    tempstartdate !== "Invalid Date" &&
                    tempenddate !== "Invalid Date"
                ) {
                    filterVariable === "&$filter="
                        ? (filterVariable += `(Created ge '${tempstartdate}' and Created le '${tempenddate}')`)
                        : (filterVariable += ` and (Created ge '${tempstartdate}' and Created le '${tempenddate}')`)
                }
            }

            // console.log(filterVariable);
            return filterVariable
        } catch (error) {
            console.error("Error while customSearch", error)
        }
    }

    /**
     * This Method Fetch All Ticket From Custom List and Also Perfom Custom Search Operation Using Custom Search Method.
     */
    private fetchSearchResult = async () => {
        try {
            const { absUrl, httpClient } = this.props
            let customfilter = this.customSearch()
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.TICKET_INFORMATION_TABLE,
                filters: `$select=*,Author/Title,Editor/Title,CustomerDetails/CustomerName,AssignedTo/Title,ProductId/ProductName,StatusId/StatusTypeName&$expand=Author,Editor,CustomerDetails,AssignedTo,ProductId,StatusId${customfilter}&$orderby=Modified desc`,
                // filters: `$select=*,ChecklistTransaction/Id,ChecklistTransaction/ProductName,ChecklistTransaction/ReleaseName,ChecklistTransaction/JiraTicketNo,Author/Title,Editor/Title,ApprovedBy/Title&$expand=ChecklistTransaction,Author,Editor,ApprovedBy${this.customSearch()}&$orderby=Modified desc`
            })
            // console.log(params);
            const response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            const result = await response.json()
            // console.log(result);
            let downloadResult = result.value.length
                ? result.value.map((x: any, ind: number) => ({
                      SR: ind + 1,
                      TicketNo: x.TicketNo,
                      TicketTitle: x.Title,
                      CustomerName: x.CustomerDetails.CustomerName,
                      ProductName: x.ProductId.ProductName,
                      Priority: x.TicketPriority,
                      AssignedTo: x.AssignedTo.Title,
                      CreatedBy: x.Author.Title,
                      DueDate: dayjs(x.TicketDueDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                      ),
                      TicketStatus: x.StatusId.StatusTypeName,
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
                              customerName: x.CustomerDetails.CustomerName,
                              productName: x.ProductId.ProductName,
                              priority: x.TicketPriority,
                              assignedTo: x.AssignedTo.Title,
                              createdBy: x.Author.Title,
                              dueDate: dayjs(x.TicketDueDate).format(
                                  "YYYY-MM-DD HH:mm:ss"
                              ),
                              ticketStatus: x.StatusId.StatusTypeName,
                              actions: x.Id,
                          } as TicketCols)
                  )
                : []
            // console.log(_data);
            this.setState({ rowData: _data })
        } catch (error) {
            console.error("Error while fetch Search Result", error)
        }
    }

    /**
     * This Method Export Selected Data Into Excel File.
     * ! We Need To Put Validation For Download. (Range Validation)
     */
    downloadSearchResult = async () => {
        try {
            let datarows = this.state.downloadData
            var workbook = new Exceljs.Workbook()
            //create new sheet in workbook
            var sheet = workbook.addWorksheet("Export Data")

            let columns = [
                { header: "Ticket No", key: "ProductName", width: 26 },
                { header: "Ticket Title", key: "ReleaseName", width: 26 },
                { header: "Customer Name", key: "ReleaseType", width: 26 },
                { header: "Priority", key: "JiraTicketNo", width: 26 },
                { header: "Assigned To", key: "SubmittedBy", width: 26 },
                { header: "Created By", key: "ApprovedAt", width: 26 },
                { header: "Due Date", key: "TransactionID", width: 26 },
                {
                    header: "Ticket Status",
                    key: "TransactionStatus",
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
                    `History_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
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
export default connect(mapStateToProps)(SearchTickets)
