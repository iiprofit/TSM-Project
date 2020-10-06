/**
 * React Package Import
 */
import * as React from "react";

/**
 * Component Specific CSS Import
 */
import "./Customer.scss";

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

/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 *
 */
import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";

/**
 * This Package Is Used To Generate Unique ID's.
 */
import * as uuid from "uuid";

/**
 * Helper Section's Methods Import.
 * @param createItemParams Insert Data Into Any Custom List Of SharePoint.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { createItemParams, listTitles } from "../../../helper";

/**
 * Current Component Props Import From Global Props Location.
 */
import { IAddCustomerProp } from "../../../Store/Types";

/**
 * Ant Deisgn Component Imports
 */
import {
  Table,
  Row,
  Col,
  Input,
  Button,
  message,
  Modal,
  Space,
  Select,
  Spin,
  DatePicker,
  Tooltip,
  Layout,
  Form,
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
type IAddCustomerStates = {
  isActive: boolean;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  validated: boolean;
  invalidItems: Array<string>;
  showConfirmation: boolean;
  saveConfirm: boolean;
  isLoading: boolean;
  isButtonLoading: boolean;
};

//@ts-ignore
const loadingIcon = <LoadingOutlined spin className="custom-icon" />;

/**
 * Main Class Of Component.
 */
class AddCustomer extends React.Component<
  IAddCustomerProp,
  IAddCustomerStates
> {
  /**
   * State Initialization.
   */
  public state: IAddCustomerStates = {
    isActive: true,
    validated: true,
    customerName: "",
    customerEmail: "",
    customerCity: "",
    invalidItems: [],
    showConfirmation: false,
    saveConfirm: false,
    isLoading: false,
    isButtonLoading: false,
  };

  /**
   * React Life Cycle Method
   */
  public componentDidMount() {}

  /**
   * Render() Method
   */
  render(): React.ReactElement {
    // Destructuring Of States
    const {
      isActive,
      validated,
      invalidItems,
      showConfirmation,
      saveConfirm,
      customerName,
      customerCity,
      customerEmail,
      isButtonLoading,
      isLoading,
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
            {/* Customer Name Section Start  */}
            <Form.Item label="Customer Name">
              <Input
                defaultValue={customerName}
                value={customerName}
                onChange={(e) =>
                  this.setState({ customerName: e.target.value })
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
                  this.setState({ customerCity: e.target.value })
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
                  this.setState({ customerCity: e.target.value })
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
   * This Method Perform Validation Checks
   */
  handleSubmit = async () => {
    try {
      if (
        this.state.customerName === "" ||
        this.state.customerCity === "" ||
        this.state.customerEmail === ""
      ) {
        message.info("Invalid Entries. Please Enter the Required the fields");
      } else {
        this.setState({ isButtonLoading: true }, async () => {
          this.saveCustomer();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This Method Redirect Users To Customer Tab
   */
  onCancelClick = () => {
    this.props.history.push("/admin/customer-information");
  };

  /**
   * This Method Close Confirmation Dialog Box
   * !We Need to delete this code
   */
  // closeConfirmationDialog = () => {
  //   this.setState({ showConfirmation: false });
  // };

  /**
   * This Method Close Save Confirmation Dialog Box
   * Redirect The User To Customer Tab
   * ! I Need To Delete This Code
   */
  // closeSaveConfirmDialog = () => {
  //   this.setState({ saveConfirm: false });
  //   this.props.history.push("/admin/customer-information");
  // };

  /**
   * This Method Save Data Into Custom List
   */
  saveCustomer = async () => {
    const { isActive, customerName, customerEmail, customerCity } = this.state;
    const { absUrl } = this.props;
    const { url, config, options } = createItemParams({
      absoluteUrl: absUrl,
      listTitle: listTitles.CUSTOMER_INFORMATION,
      body: {
        __metadata: { type: "SP.Data.ChecklistItemTableListItem" },
        CustomerName: customerName,
        CustomerEmail: customerEmail,
        CustomerCity: customerCity,
        IsActive: isActive,
        uuid: uuid.v4(),
      },
    });

    try {
      const response: SPHttpClientResponse = await this.props.httpClient.post(
        url,
        config,
        options
      );
      const result = await response.json();

      if (result.status == 200) {
        this.setState({ isButtonLoading: false }, () => {
          message.success("Data Inserted Successfully");
        });
      } else {
        this.setState({ isButtonLoading: false }, () => {
          message.error("Something Is Wrong!!! Try Again Latter");
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This Method Is Used To Take Final Save Confirmation
   * ! I Need To Delete This Code
   */
  // onSaveConfirm = () => {
  //   this.saveCustomer().then(() => {
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
});

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(AddCustomer);
