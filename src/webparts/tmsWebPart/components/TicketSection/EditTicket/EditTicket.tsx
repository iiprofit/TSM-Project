/**
 * React Package Import
 */
import * as React from "react";

/**
 * Component Specific CSS Import
 */
import "./StatusType.scss";

/**
 * React-Router Paclage Import
 * @param Link This Method us used to Redirect Users To Specfic Section.
 */
import { Link } from "react-router-dom";

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux";

import {
  readItemParams,
  listTitles,
  updateItemParams,
  sendEmailParams,
  readItemsParams,
} from "../../../helper";

/**
 * Current Component Props Import From Global Props Location.
 */
import { IEditTicketProp } from "../../../Store/Types";

/**
 * This is Time Formating Library
 */
//@ts-ignore
import moment from "moment";
/**
 * Ant Deisgn Component Imports
 */
import {
  Table,
  Row,
  Col,
  Input,
  Button,
  Modal,
  Space,
  Select,
  Spin,
  DatePicker,
  Tooltip,
  Layout,
  Form,
  message,
} from "antd";

/**
 * Ant Design Icons Import
 */
import {
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  UserAddOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";

// This Options Component Is Used With Select Component.
const { Option } = Select;

/**
 * Custom Component Import.
 * This Component Take Final Confirmaiton Of User.
 */
import ConfirmationDialog from "../../Dialogs/ConfirmationDialog";

/**
 * Custom Component Import.
 * This Component Show Success Message Of Any Operation Performed By User.
 */
import SuccessDialog from "../../Dialogs/SuccessDialog";

/**
 * Types Declaration Of Current Component States
 */
type IEditTicketStates = {
  ticketNo?: string;
  ticketTitle?: string;
  customerName?: Array<any>;
  customerNameSelected: Array<any>;
  productName?: Array<any>;
  productNameSelected: Array<any>;
  priority?: Array<any>;
  prioritySelected: Array<any>;
  assignedTo?: Array<any>;
  assignedToSelected: Array<any>;
  dueDate?: Date;
  ticketStatus?: Array<any>;
  ticketStatusSelected: Array<any>;
  validated: boolean;
  invalidItems: Array<any>;
  showConfirmation: boolean;
  saveConfirm: boolean;
  isLoading: boolean;
  isButtonLoading: boolean;
  allUserData: Array<any>;
  etag: any;
};

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />;

/**
 * Main Class Of Component.
 */
class IEditTicket extends React.Component<IEditTicketProp, IEditTicketStates> {
  /**
   * State Initialization.
   */
  public state: IEditTicketStates = {
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
    dueDate: new Date(),
    ticketStatus: [],
    validated: true,
    invalidItems: [],
    showConfirmation: false,
    saveConfirm: false,
    etag: null,
    assignedToSelected: [],
    customerNameSelected: [],
    prioritySelected: [],
    productNameSelected: [],
    ticketStatusSelected: [],
    allUserData: [],
    isButtonLoading: false,
    isLoading: false,
  };

  /**
   * React Life Cycle Method.
   * This Method Call Method Which Fetch Specific Status Type Data.
   */
  public componentDidMount() {
    try {
      this.onSearchParamsFetch().then(() => {
        this.onRequestereFetch();
        this.onFetchCustomer();
        this.onFetchProducts();
        this.onFetchTypes();
      });
      if (this.props.match.params.id) {
        const _id = parseInt(this.props.match.params.id);
        this.fetchTicketDetails(_id);
      }
    } catch (error) {
      console.error("Error while Edit Ticket componentDidMount");
    }
  }

  /**
   * Render() Method
   */
  render(): React.ReactElement {
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
    } = this.state;

    /**
     *  Form Layout Attributes.
     *  Form Design Based On Below Mentioned Attributes.
     */
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <>
        {/* Spin Component Is Used For Loading Process */}
        {/* We Need To impliment Is loading In Spin */}
        <Spin spinning={isLoading} indicator={loadingIcon}>
          <Form {...layout} labelAlign="left">
            {/* Ticket Title Section Start  */}
            <Form.Item label="Customer Name">
              <Input
                defaultValue={ticketTitle}
                value={ticketTitle}
                onChange={(e) => this.setState({ ticketTitle: e.target.value })}
                placeholder="Enter customer name"
              />
            </Form.Item>
            {/* Ticket Title Section End  */}

            {/* Customer Name Section Start  */}
            <Form.Item label="Customer Name">
              <Select
                showSearch
                style={{ width: 200 }}
                value={customerNameSelected}
                optionFilterProp="children"
                onChange={(value) =>
                  this.setState({ customerNameSelected: value })
                }
              >
                {customerName &&
                  customerName.map((items) => (
                    <Option value={items.value}>{items.text}</Option>
                  ))}
              </Select>
            </Form.Item>
            {/* Customer Name Section Start   */}

            {/* Product Section Start  */}
            <Form.Item label="Select Product">
              <Select
                showSearch
                style={{ width: 200 }}
                value={productNameSelected}
                optionFilterProp="children"
                onChange={(value) =>
                  this.setState({ productNameSelected: value })
                }
              >
                {productName &&
                  productName.map((items) => (
                    <Option value={items.value}>{items.text}</Option>
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
                    <Option value={items.value}>{items.text}</Option>
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
                  this.setState({ ticketStatusSelected: value })
                }
              >
                {ticketStatus &&
                  ticketStatus.map((items) => (
                    <Option value={items.value}>{items.text}</Option>
                  ))}
              </Select>
            </Form.Item>
            {/* Ticket Status  Section End  */}

            {/* Ticket Status Section Start  */}
            <Form.Item label="Ticket Status">
              <Select
                showSearch
                style={{ width: 200 }}
                value={prioritySelected}
                optionFilterProp="children"
                onChange={(value) => this.setState({ prioritySelected: value })}
              >
                {priority &&
                  priority.map((items) => (
                    <Option value={items.value}>{items.text}</Option>
                  ))}
              </Select>
            </Form.Item>
            {/* Ticket Status  Section End  */}

            {/* Start Date Selection Section Start */}
            <Form.Item label="Due Date">
              <DatePicker
                style={{ width: "100%" }}
                format="MM-DD-YYYY"
                value={dueDate ? moment(dueDate) : ""}
                onChange={(value) => this.setState({ dueDate: moment(value) })}
              />
            </Form.Item>
            {/* Start Date Selection Section Start */}

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
                  <Button type="primary" onClick={this.onCancelClick}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            {/* Action Button Section End */}
          </Form>
        </Spin>
      </>
    );
  }

  /**
   * This Method Fetch all Users From USer Table So We Can Used Them In Future.
   */
  onSearchParamsFetch = async () => {
    try {
      const { absUrl, httpClient } = this.props;
      const params = readItemsParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.USER_ROLE_TABLE,
        filters: "$select=*,Email/EMail&$expand=Email/EMail",
      });

      let response = await httpClient.get(
        params.url,
        params.config,
        params.options
      );
      let result = await response.json();
      this.setState({
        allUserData: result.value,
      });
    } catch (error) {
      console.error("Error while onSearchParamsFetch", error);
    }
  };

  /**
   * This Method Fetch All Requesters And Arrange Them So We Can Use Them In Ant Design Select Control.
   */
  onRequestereFetch = async () => {
    try {
      let { allUserData } = this.state;
      let tempRequesterValue = await allUserData.filter((users) => {
        return users.Rights.includes("requester");
      });
      let _result = tempRequesterValue.map((x: any, ind: number) => {
        return {
          value: x.EmailId ? x.EmailId : "",
          text: x.FirstName ? x.FirstName : "",
        };
      });
      this.setState({ assignedTo: _result });
    } catch (error) {
      console.error("Error while On Requester Fetch", error);
    }
  };

  /**
   * This Method Fetch All Customers And Arrange Them So We Can Use Them In Ant Design Select Control.
   */
  onFetchCustomer = async () => {
    try {
      const { absUrl, httpClient } = this.props;
      const params = readItemsParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.CUSTOMER_INFORMATION,
        filters: "",
      });

      let response = await httpClient.get(
        params.url,
        params.config,
        params.options
      );
      let result = await response.json();
      let _result = await result.value.map((x: any, ind: number) => {
        return {
          value: x.Id ? x.Id : "",
          text: x.CustomerName ? x.CustomerName : "",
        };
      });
      this.setState({
        customerName: _result,
      });
    } catch (error) {
      console.error("Error while on fetch customer seciton", error);
    }
  };

  /**
   * This Method Fetch All Status Types And Arrange Them So We Can Use Them In Ant Design Select Control.
   */
  onFetchTypes = async () => {
    try {
      const { absUrl, httpClient } = this.props;
      const { ticketStatus } = this.state;
      const params = readItemsParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.STATUS_TYPE,
        filters: "",
      });

      let response = await httpClient.get(
        params.url,
        params.config,
        params.options
      );
      let result = await response.json();
      let _result = await result.value.map((x: any, ind: number) => {
        return {
          value: x.Id ? x.Id : "",
          text: x.StatusTypeName ? x.StatusTypeName : "",
        };
      });
      this.setState({
        ticketStatus: _result,
      });
    } catch (error) {
      console.error("Error while On Fetch Status Type", error);
    }
  };

  /**
   * This Method Fetch All Products And Arrange Them So We Can Use Them In Ant Design Select Control.
   */
  onFetchProducts = async () => {
    try {
      const { absUrl, httpClient } = this.props;
      const { productName } = this.state;
      const params = readItemsParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.PRODUCT_INFORMATION,
        filters: "",
      });

      let response = await httpClient.get(
        params.url,
        params.config,
        params.options
      );
      let result = await response.json();
      let _result = await result.value.map((x: any, ind: number) => {
        return {
          value: x.Id ? x.Id : "",
          text: x.ProductName ? x.ProductName : "",
        };
      });
      this.setState({
        productName: _result,
      });
    } catch (error) {
      console.error("Error while On Fetch Prodicts", error);
    }
  };

  /**
   * This Method Perform Validation Checks
   */
  handleSubmit = async () => {
    try {
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
      } = this.state;

      if (
        productNameSelected ||
        ticketStatusSelected ||
        prioritySelected ||
        customerNameSelected ||
        assignedToSelected ||
        ticketTitle == ""
      ) {
        message.info("Invalid Entries. Please Fill All the fields");
      } else {
        this.setState({ isButtonLoading: true }, async () => {
          this.updateTicket();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This Method Specific Data Based On Given It
   */
  fetchTicketDetails = async (itemId) => {
    try {
      const { httpClient, absUrl } = this.props;
      const param = readItemParams({
        absoluteUrl: absUrl,
        itemId: itemId,
        listTitle: listTitles.TICKET_INFORMATION_TABLE,
        filters: "",
      });
      const response = await httpClient.get(
        param.url,
        param.config,
        param.options
      );
      const result = await response.json();
      this.setState({
        etag: response.headers.get("ETag"),
      });
      const _item = result;
      this.setState({
        ticketTitle: _item.Title,
        customerName: _item.CustomerDetails.CustomerName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This Method Perform Validation Checks
   */
  onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let validated = false;
    let invalidTexts = [];
    const { ticketTitle } = this.state;

    validated = ticketTitle ? true : false;
    !validated && invalidTexts.push("Status Type can not be blank");

    this.setState({
      validated: validated,
      invalidItems: invalidTexts,
      showConfirmation: validated,
    });
  };

  /**
   * This Method Redirect Users To Customer Tab
   */
  onCancelClick = () => {
    this.props.history.push("/admin/status-type");
  };

  /**
   * This Method Update Data Of Custom List.
   */
  private updateTicket = async () => {
    try {
      const {
        etag,
        assignedToSelected,
        customerNameSelected,
        prioritySelected,
        productNameSelected,
        ticketNo,
        ticketStatus,
        ticketTitle,
        dueDate,
      } = this.state;
      const { absUrl, match, httpClient } = this.props;

      const { url, config, options } = updateItemParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.TICKET_INFORMATION_TABLE,
        body: {
          __metadata: { type: "SP.Data.ChecklistItemTableListItem" },
          Title: ticketTitle,
          CustomerId: customerNameSelected,
          ProductId: productNameSelected,
          TicketPriorty: prioritySelected,
          AssignedTo: assignedToSelected,
          TicketDueDate: dueDate,
          StatusId: ticketStatus,
        },
        etag: etag,
        itemId: parseInt(match.params.id),
      });
      const response = await httpClient.post(url, config, options);

      const result = await response.json();
      if (result.status == 200) {
        this.setState({ isButtonLoading: false }, () => {
          message.success("Data Updated Successfully");
        });
      } else {
        this.setState({ isButtonLoading: false }, () => {
          message.error("Something Is Wrong!!! Try Again Latter");
        });
      }
      return true;
    } catch (error) {
      console.error("Error while update status-type " + error);
    }
  };
}

/**
 * Redux Map Funtion Which Map Global Store's State To Props Of Current Component.
 */
const mapStateToProps = (state) => ({
  absUrl: state.dashboard.absoluteUrl,
  httpClient: state.dashboard.httpClient,
});

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(IEditTicket);
