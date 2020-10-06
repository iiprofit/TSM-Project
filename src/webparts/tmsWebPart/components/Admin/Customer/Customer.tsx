/**
 * React Package Import
 */
import * as React from "react";
import * as ReactDom from "react-dom";

/**
 * React-Router Paclage Import
 * @param Link This Method us used to Redirect Users To Specfic Section.
 */
import { Link } from "react-router-dom";

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
  Tooltip,
  Layout,
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

/**
 * React-Redux Method Import.
 * @param connect This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux";

/**
 * Current Component Props Import From Global Props Location.
 */
import { ICustomerProp } from "../../../Store/Types";

/**
 * Helper Section's Methods Import.
 * @param readItemsParams Fetch All Data From Custom List Of SharePoint.
 * @param listTitles This Object Contain Name Of All The List Which Will Use In This Project.
 */
import { readItemsParams, listTitles } from "../../../helper";

/**
 * This Code Block Is Type Declaration Of DataTable
 */
type CustomerCols = {
  sr?: Number;
  customerName?: String;
  customerEmail?: String;
  isActive?: String;
  actions?: any;
};

/**
 * Types Declaration Of Current Component States
 * ! I Need To Re-Wirte And un comment states
 */
type ICustomerState = {
  rowData: Array<CustomerCols>;
  columns: Array<any>;
  customerSearch: string;
};

/**
 * Main Class Of Component.
 */
class Customer extends React.Component<ICustomerProp, ICustomerState> {
  /**
   * State Initialization.
   */
  public state: ICustomerState = {
    columns: [
      { title: "Sr#", data: "sr", key: "sr" },
      {
        title: "Customer Name",
        dataIndex: "customerName",
        key: "customerName",
      },
      {
        title: "Email Address",
        dataIndex: "customerEmail",
        key: "customerEmail",
      },
      {
        title: "City",
        dataIndex: "customerCity",
        key: "customerCity",
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
          <Button
            shape="circle"
            type="link"
            /*@ts-ignore*/
            icon={<EditOutlined />}
            onClick={() => console.log(record)}
          />;
        },
      } as any,
    ],
    rowData: [],
    customerSearch: "",
  };

  /**
   * React Life Cycle Method
   * This Method Also Called Funtion Which Fetch All Customer Details.
   */
  public componentDidMount() {
    this.fetchCustomers();
  }

  /**
   * Render() Method
   */
  public render(): React.ReactElement {
    const { columns, rowData, customerSearch } = this.state;
    return (
      <>
        {/* Spin Component Is Used For Loading Process */}
        {/* We Need To impliment Is loading In Spin */}
        <Spin>
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
                      placeholder="Search Customers"
                      value={customerSearch}
                      onChange={(e) => {
                        this.setState({ customerSearch: e.target.value });
                      }}
                    />
                    <Button
                      type="primary"
                      /*@ts-ignore*/
                      icon={<EditOutlined />}
                      size="middle"
                      onClick={this.fetchCustomers}
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
    );
  }

  /**
   * This Method Fetch All The Data Of Customers For DataTable
   */
  private fetchCustomers = async () => {
    try {
      const { absUrl, httpClient } = this.props;
      let customfilter = this.customSearch();
      const params = readItemsParams({
        absoluteUrl: absUrl,
        listTitle: listTitles.CUSTOMER_INFORMATION,
        filters: `$select=*,Email/EMail&$expand=Email/EMail${customfilter}`,
      });
      const response = await httpClient.get(
        params.url,
        params.config,
        params.options
      );
      const result = await response.json();
      const _data: Array<CustomerCols> = result.value.length
        ? result.value.map(
            (x: any, ind: number) =>
              ({
                sr: ind + 1,
                customerName: x.CustomerName,
                customerEmail: x.CustomerEmail,
                customerCity: x.CustomerCity,
                isActive: x.IsActive ? "Yes" : "No",
                actions: x.Id,
              } as CustomerCols)
          )
        : [];
      this.setState({ rowData: _data });
    } catch (error) {
      console.error("Error while Fetch All Customer Details", error);
    }
  };

  /**
   * This Method Is Used To Build Search Parameters Which Latter Can Be Used In FetchStatusType Method.
   */
  private customSearch = () => {
    try {
      let { customerSearch } = this.state;
      let filterVariable: string = "";
      if (customerSearch) {
        filterVariable =
          "&$filter=StatusTypeName eq" +
          customerSearch +
          "or Email/EMail eq" +
          customerSearch;
      } else {
        filterVariable = "";
      }
      return filterVariable;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This Method Re-Direct Admin to Edit Customer Page With ID
   * @param value This Is Id Of Customer's Which Data Admin Wants To Edit
   */
  private goToEditCustomer = (value) => {
    this.props.history.push({
      pathname: `/edit-customer/${value}`,
      state: {
        customerId: value,
      },
    });
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
export default connect(mapStateToProps)(Customer);
