/**
 * Import React Library.
 */
import * as React from "react";

import {
  Table,
  Row,
  Tabs,
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

const { TabPane } = Tabs;

import { Route } from "react-router-dom";

/**
 * React Router Dom Package Import.
 * This Package Is Mainly Used For Routing Functinality.
 * @Route
 * @Redirect
 */
// import { Route } from "react-router-dom";

import { ITicketSectionProp } from "../../Store/Types";

/**
 * React-Redux Method Import.
 * This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux";

/**
 * Declaring Types Of Compoent States
 */
export interface ITicketSectionState {
  activeTab: any;
}

/**
 * Customer Component Import
 */

import ClosedTickets from "./ClosedTickets/ClossedTickets";
import DueTickets from "./DueTickets/DueTickets";
import DueTodayTickets from "./DueTodayTicket/DueTodayTickets";
import InProgrssTickets from "./InProgressTickets/InProgressTickets";

class TicketSection extends React.Component<
  ITicketSectionProp,
  ITicketSectionState
> {
  // Component State Section
  // ! We Need To Update Default Active Tab
  public state = {
    activeTab: "inProgressTickets",
  };

  componentDidMount() {
    try {
      this.updateActivetab(this.props.location.pathname);
      this.props.history.listen((location) => {
        this.updateActivetab(location.pathname);
      });
    } catch (error) {
      console.log(error);
    }
  }

  public render(): React.ReactElement<{}> {
    return (
      <>
        <>
          <Tabs defaultActiveKey="inProgressTickets">
            <TabPane tab="In-Progress" key="inProgressTickets">
              <Route
                path="/ticketsection/in-progress"
                component={InProgrssTickets}
              />
            </TabPane>
            <TabPane tab="Closed Tickets" key="closedTickets">
              <Route
                path="/ticketsection/closed-tickets"
                component={ClosedTickets}
              />
            </TabPane>
            <TabPane tab="Due Tickets" key="dueTickets">
              <Route path="ticketsection/due-tickets" component={DueTickets} />
            </TabPane>
            <TabPane tab="Due Today" key="dueTodayTickets">
              <Route
                path="/ticketsection/due-todays-tickets"
                component={DueTodayTickets}
              />
            </TabPane>
            <TabPane tab="TAT" key="tat">
              <div>
                {" "}
                <h4> TAT Section </h4>{" "}
              </div>
            </TabPane>
          </Tabs>
        </>
      </>
    );
  }

  private onTabSelect = (tab) => {
    try {
      const { history } = this.props;
      this.setState({ activeTab: tab });

      switch (tab) {
        case "inProgressTickets":
          history.push("/ticketsection/in-progress");
          break;
        case "closedTickets":
          history.push("/admin/closed-tickets");
          break;
        case "dueTickets":
          history.push("/admin/due-tickets");
          break;
        case "dueTodayTickets":
          history.push("/admin/due-todays-tickets");
          break;
        case "tat":
          history.push("/admin/tat-tickets");
          break;
        default:
          history.push("/ticketsection/in-progress");
          break;
      }
    } catch (error) {
      console.error("Error while onTabSelect", error);
    }
  };

  private updateActivetab = (location: string) => {
    try {
      //@ts-ignore
      if (location.includes("in-progress")) {
        this.setState({ activeTab: "inProgressTickets" });
      }
      //@ts-ignore
      else if (location.includes("closed-tickets")) {
        this.setState({ activeTab: "closedTickets" });
      }
      //@ts-ignore
      else if (location.includes("due-tickets")) {
        this.setState({ activeTab: "dueTickets" });
      }
      //@ts-ignore
      else if (location.includes("due-todays-tickets")) {
        this.setState({ activeTab: "dueTodayTickets" });
      }
      //@ts-ignore
      else if (location.includes("tat-tickets")) {
        this.setState({ activeTab: "tat" });
      } else {
        this.setState({
          activeTab: "inProgressTickets",
        });
      }
    } catch (error) {
      console.error("Error while updateActivetab", error);
    }
  };
}

export default connect()(TicketSection);
