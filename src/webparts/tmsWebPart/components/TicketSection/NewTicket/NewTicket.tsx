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
import { INewTicketProp } from "../../../Store/Types"

/**
 * This is Time Formating Library
 */
import * as moment from "moment"
/**
 * Ant Deisgn Component Imports
 */
import {
    Row,
    Col,
    Input,
    Button,
    Select,
    Spin,
    DatePicker,
    Form,
    message,
    Space,
} from "antd"

/**
 * Ant Design Icons Import
 */
import { LoadingOutlined } from "@ant-design/icons"

// This Options Component Is Used With Select Component.
const { Option } = Select

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
 * @param createItemParams Insert Data Into Any Custom List Of SharePoint.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import {
    readItemsParams,
    listTitles,
    createItemParams,
    readItemParams,
    sendEmailParams,
} from "../../../helper"

/**
 * This Package Is Used To Generate Unique ID's.
 */
import * as uuid from "uuid"

/**
 * Types Declaration Of Current Component States
 */
type INewTicketStates = {
    allUserData: Array<any>
    assignedTo?: Array<any>
    assignedToSelected: any
    comment: string
    customerName?: Array<any>
    customerNameSelected: Array<any>
    description: string
    dueDate?: moment.Moment
    etag: string
    invalidItems: Array<any>
    isButtonLoading: boolean
    isLoading: boolean
    priority?: Array<any>
    prioritySelected: Array<any>
    productName?: Array<any>
    productNameSelected: Array<any>
    saveConfirm: boolean
    showConfirmation: boolean
    ticketNo?: string
    ticketStatus?: Array<any>
    ticketStatusSelected: Array<any>
    ticketTitle?: string
    validated: boolean
}

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />

/**
 * Main Class Of Component.
 */
class NewTicket extends React.Component<INewTicketProp, INewTicketStates> {
    /**
     * State Initialization.
     */
    public state: INewTicketStates = {
        ticketNo: "",
        ticketTitle: "",
        customerName: [],
        productName: [],
        priority: [
            { value: "High", text: "High" },
            { value: "Medium", text: "Medium" },
            { value: "Low", text: "Low" },
            { value: "None", text: "None" },
        ],
        assignedTo: [],
        dueDate: moment(),
        ticketStatus: [],
        validated: true,
        invalidItems: [],
        showConfirmation: false,
        saveConfirm: false,
        isLoading: false,
        isButtonLoading: false,
        assignedToSelected: [],
        customerNameSelected: [],
        prioritySelected: [],
        productNameSelected: [],
        ticketStatusSelected: [],
        allUserData: [],
        comment: null,
        description: null,
        etag: null,
    }

    /**
     * React Life Cycle Method.
     * This Method Call All Supported Methods Which Fetch Data For Dropdown/Select Controls
     */
    public componentDidMount() {
        console.log(this.props)
        if (this.props.mode === "edit") {
            this.fetchTicketDetails(this.props.match.params.id)
        }
        this.onSearchParamsFetch().then(() => {
            this.onRequestereFetch()
            this.onFetchCustomer()
            this.onFetchProducts()
            this.onFetchTypes()
        })
        try {
        } catch (error) {
            console.error("Error while componentDidMount", error)
        }
    }

    /**
     * Render() Method
     */
    public render(): React.ReactElement {
        // Destructuring Of States
        let {
            ticketTitle,
            productNameSelected,
            productName,
            ticketStatusSelected,
            ticketStatus,
            prioritySelected,
            priority,
            customerNameSelected,
            customerName,
            assignedToSelected,
            assignedTo,
            isButtonLoading,
            isLoading,
            dueDate,
            allUserData,
            comment,
            description,
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
                        {/* Ticket Title Section Start  */}
                        <Form.Item label="Title">
                            <Input
                                defaultValue={ticketTitle}
                                value={ticketTitle}
                                onChange={(e) =>
                                    this.setState({
                                        ticketTitle: e.target.value,
                                    })
                                }
                                placeholder="Enter title"
                            />
                        </Form.Item>
                        {/* Ticket Title Section End  */}
                        <Form.Item label="Description">
                            <Input.TextArea
                                value={description}
                                onChange={(e) =>
                                    this.setState({
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter description"
                            />
                        </Form.Item>
                        {/* Customer Name Section Start  */}
                        <Form.Item label="Customer Name">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                value={customerNameSelected}
                                optionFilterProp="children"
                                onChange={(value) =>
                                    this.setState({
                                        customerNameSelected: value,
                                    })
                                }
                            >
                                {customerName &&
                                    customerName.map((items) => (
                                        <Option value={items.value}>
                                            {items.text}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {/* Customer Name Section Start   */}

                        {/* Product Section Start  */}
                        <Form.Item label="Product">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                value={productNameSelected}
                                optionFilterProp="children"
                                onChange={(value) =>
                                    this.setState({
                                        productNameSelected: value,
                                    })
                                }
                            >
                                {productName &&
                                    productName.map((items) => (
                                        <Option value={items.value}>
                                            {items.text}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {/* Product Section Start Section End  */}

                        {/* Assigned To Section Start  */}
                        <Form.Item label="Assigned To">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                value={assignedToSelected}
                                optionFilterProp="children"
                                onChange={(value) =>
                                    this.setState({ assignedToSelected: value })
                                }
                            >
                                {assignedTo &&
                                    assignedTo.map((items) => (
                                        <Option value={items.value}>
                                            {items.text}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {/* Assigned To  Section End  */}

                        {/* Ticket Status Section Start  */}
                        <Form.Item label="Ticket Status">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                value={ticketStatusSelected}
                                optionFilterProp="children"
                                onChange={(value) =>
                                    this.setState({
                                        ticketStatusSelected: value,
                                    })
                                }
                            >
                                {ticketStatus &&
                                    ticketStatus.map((items) => (
                                        <Option value={items.value}>
                                            {items.text}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {/* Ticket Status  Section End  */}

                        {/* Ticket Status Section Start  */}
                        <Form.Item label="Priority">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                value={prioritySelected}
                                optionFilterProp="children"
                                onChange={(value) =>
                                    this.setState({ prioritySelected: value })
                                }
                            >
                                {priority &&
                                    priority.map((items) => (
                                        <Option value={items.value}>
                                            {items.text}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                        {/* Ticket Status  Section End  */}

                        {/* Start Date Selection Section Start */}
                        <Form.Item label="Due Date">
                            <DatePicker
                                style={{ width: "100%" }}
                                format="MM-DD-YYYY"
                                value={dueDate}
                                onChange={(value) =>
                                    this.setState({ dueDate: moment(value) })
                                }
                            />
                        </Form.Item>
                        {/* Start Date Selection Section Start */}
                        <Form.Item label="Comment">
                            <Input.TextArea
                                value={comment}
                                onChange={(e) =>
                                    this.setState({
                                        comment: e.target.value,
                                    })
                                }
                                placeholder="Enter comment"
                            />
                        </Form.Item>
                        {/* Action Button Section Start */}
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    loading={isButtonLoading}
                                    onClick={this.handleSubmit}
                                    className="mr-2"
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={this.onCancelClick}
                                >
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                        {/* Action Button Section End */}
                    </Form>
                </Spin>
            </>
        )
    }

    /**
     * This Method Generate Unique Id For Each item.
     */
    private generateTicketId = ({ id }) => {
        try {
            console.log(id)
            let newId = id + 1
            let len = id.toString().length
            let missingLen = 4 - len

            let customizedId =
                // @ts-ignore
                missingLen > 0
                    ? "0".repeat(missingLen) + newId
                    : newId.toString()
            return customizedId
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Fetch all Users From USer Table So We Can Used Them In Future.
     */
    private onSearchParamsFetch = async () => {
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
    private onRequestereFetch = async () => {
        try {
            let { allUserData } = this.state
            let tempRequesterValue = await allUserData.filter((users) => {
                return users.Rights.includes("requester")
            })
            let _result = tempRequesterValue.map((x: any, ind: number) => {
                return {
                    value: x.EmailId ? x.EmailId : "",
                    text: x.FirstName ? x.FirstName : "",
                    email: x.EmailId ? x.Email.EMail : "",
                }
            })
            this.setState({ assignedTo: _result })
        } catch (error) {
            console.error("Error while On Requester Fetch", error)
        }
    }

    /**
     * This Method Fetch All Customers And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    private onFetchCustomer = async () => {
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
                    value: x.Id ? x.Id : "",
                    text: x.CustomerName ? x.CustomerName : "",
                }
            })
            this.setState({
                customerName: _result,
            })
        } catch (error) {
            console.error("Error while on fetch customer seciton", error)
        }
    }

    /**
     * This Method Fetch All Status Types And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    private onFetchTypes = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const { ticketStatus } = this.state
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
                ticketStatus: _result,
            })
        } catch (error) {
            console.error("Error while On Fetch Status Type", error)
        }
    }

    /**
     * This Method Fetch All Products And Arrange Them So We Can Use Them In Ant Design Select Control.
     */
    private onFetchProducts = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const { productName } = this.state
            const params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.PRODUCT_INFORMATION,
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
                    text: x.ProductName ? x.ProductName : "",
                }
            })
            this.setState({
                productName: _result,
            })
        } catch (error) {
            console.error("Error while On Fetch Prodicts", error)
        }
    }

    /**
     * This Method Perform Validation Checks
     */
    private handleSubmit = async () => {
        try {
            let {
                ticketTitle,
                productNameSelected,
                ticketStatusSelected,
                prioritySelected,
                customerNameSelected,
                assignedToSelected,
            } = this.state

            if (
                !productNameSelected ||
                !ticketStatusSelected ||
                !prioritySelected ||
                !customerNameSelected ||
                !assignedToSelected ||
                ticketTitle == ""
            ) {
                message.info("Invalid Entries. Please Fill All the fields")
            } else {
                this.setState({ isButtonLoading: true }, async () => {
                    this.saveNewTicket()
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This Method Store New Ticket Into SharePoint Custom List.
     */
    private saveNewTicket = async () => {
        try {
            const { absUrl, httpClient } = this.props
            const {
                assignedToSelected,
                assignedTo,
                customerNameSelected,
                prioritySelected,
                productNameSelected,
                ticketNo,
                ticketStatusSelected,
                ticketTitle,
                dueDate,
                comment,
                description,
            } = this.state

            let params = readItemsParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.TICKET_INFORMATION_TABLE,
                filters: `$top=1&$orderby=Created desc`,
                // filters: `$select=*,ChecklistTransaction/Id,ChecklistTransaction/ProductName,ChecklistTransaction/ReleaseName,ChecklistTransaction/JiraTicketNo,Author/Title,Editor/Title,ApprovedBy/Title&$expand=ChecklistTransaction,Author,Editor,ApprovedBy${this.customSearch()}&$orderby=Modified desc`
            })
            let response = await httpClient.get(
                params.url,
                params.config,
                params.options
            )
            let result = await response.json()
            console.log(result)
            let ticketId = this.generateTicketId({
                id: result.value ? result.value[0].Id : 0,
            })

            // Create transaction into Checklist Transaction table
            params = createItemParams({
                absoluteUrl: absUrl,
                listTitle: listTitles.TICKET_INFORMATION_TABLE,
                body: {
                    __metadata: {
                        type: "SP.Data.TicketInformationTableListItem",
                    },
                    TicketNo: ticketId,
                    Title: ticketTitle,
                    CustomerDetailsId: customerNameSelected,
                    ProductIdId: productNameSelected,
                    TicketPriority: prioritySelected,
                    AssignedToId: assignedToSelected,
                    TicketDueDate: dueDate.format("YYYY-MM-DD"),
                    StatusIdId: ticketStatusSelected,
                    comment,
                    description,
                },
            })
            response = await httpClient.post(
                params.url,
                params.config,
                params.options
            )
            result = await response.json()
            //send emails to respected users after transaction created
            params = sendEmailParams({
                absoluteUrl: absUrl,
                emailBody: {
                    Body: `
          <p>Ticket Title: <strong>${this.state.productName}</strong></p>
          <p>Ticket no: <strong>${this.state.ticketNo}</strong></p>
          <p>Customer Name: <strong>${this.state.customerName}</strong></p>
          <p>Product Name: <strong>${this.state.productName}</strong></p>
          <p>Ticket Priority: <strong>${this.state.priority}</strong></p>
          <p>Assigned Person Name: <strong>${this.state.assignedTo}</strong></p>
          <p>Ticket Due Date: <strong>${this.state.dueDate.format(
              "YYYY-MM-DD"
          )}</strong></p>
          <p>Ticket Status: <strong>${this.state.ticketStatus}</strong></p>
          <p>Ticket has been created.</p>`,
                    From: "",
                    Subject: `Ticket Created - Ticket Id - ${ticketId} `,
                    To: [
                        assignedTo.find((x) => x.value == assignedToSelected)
                            .email,
                    ],
                },
            })

            response = await httpClient.post(
                params.url,
                params.config,
                params.options
            )
        } catch (error) {
            console.error("Error while save New Ticket", error)
        }
    }

    /**
     * This Method Re-direct User To In-Progress Ticket Section
     */
    private onCancelClick = async () => {
        try {
            this.props.history.push({
                pathname: `/ticketsection/in-progress/`,
            })
        } catch (error) {
            console.error("Error while goToEditTicket", error)
        }
    }

    private fetchTicketDetails = async (itemId) => {
        try {
            const { httpClient, absUrl } = this.props
            const param = readItemParams({
                absoluteUrl: absUrl,
                itemId: itemId,
                listTitle: listTitles.TICKET_INFORMATION_TABLE,
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
            console.log(result)
            // this.setState({
            //     ticketTitle: _item.Title,
            //     customerNameSelected: this.state.customerName.find(
            //         (x) => x.value == _item.CustomerDetailsId
            //     ).CustomerDetailsId,
            // })
            this.setState({
                ticketNo: _item.TicketNo,
                assignedToSelected: _item.AssignedToId,
                prioritySelected: _item.TicketPriority,
                customerNameSelected: _item.CustomerDetailsId,
                dueDate: _item.TicketDueDate
                    ? moment(_item.TicketDueDate)
                    : null,
                ticketStatusSelected: _item.StatusIdId,
                ticketTitle: _item.Title,
                productNameSelected: _item.ProductIdId,
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
})

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(NewTicket)
