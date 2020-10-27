/**
 * Import React Library.
 */
import * as React from "react"

import { Tabs, Row, Col, Button } from "antd"
const { TabPane } = Tabs
import { Route, Link } from "react-router-dom"
/**
 * React-Redux Method Import.
 * This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"
import { UnregisterCallback } from "history"

import { SaveOutlined, PlusCircleFilled } from "@ant-design/icons"

/**
 * React Router Dom Package Import.
 * This Package Is Mainly Used For Routing Functinality.
 * @Route
 * @Redirect
 */
// import { Route } from "react-router-dom";

import { ITicketSectionProp } from "../../Store/Types"

/**
 * Declaring Types Of Compoent States
 */
export interface ITicketSectionState {
    activeTab: any
}

/**
 * Customer Component Import
 */

import ClosedTickets from "./ClosedTickets/ClossedTickets"
import DueTickets from "./DueTickets/DueTickets"
import DueTodayTickets from "./DueTodayTicket/DueTodayTickets"
import InProgrssTickets from "./InProgressTickets/InProgressTickets"
import TatTickets from "./TAT/TatTickets"

class TicketSection extends React.Component<
    ITicketSectionProp,
    ITicketSectionState
> {
    // Component State Section
    // ! We Need To Update Default Active Tab
    public state = {
        activeTab: "inProgressTickets",
    }

    public historyListener: UnregisterCallback = null

    componentDidMount() {
        try {
            this.historyListener = this.props.history.listen((location) => {
                this.updateActivetab(location.pathname)
            })
            this.updateActivetab(this.props.location.pathname)
        } catch (error) {
            console.error(error)
        }
    }

    componentWillUnmount() {
        if (this.historyListener) this.historyListener()
    }

    public render(): React.ReactElement<{}> {
        return (
            <>
                <>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Link to="/new-ticket">
                                <Button
                                    type="primary"
                                    /*@ts-ignore*/
                                    icon={<PlusCircleFilled />}
                                    style={{
                                        background: "green",
                                        borderColor: "#36454f",
                                    }}
                                    size="middle"
                                >
                                    Add Ticket
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Tabs
                        onChange={this.onTabSelect}
                        activeKey={this.state.activeTab}
                    >
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
                            <Route
                                path="/ticketsection/due-tickets"
                                component={DueTickets}
                            />
                        </TabPane>
                        <TabPane tab="Due Today" key="dueTodayTickets">
                            <Route
                                path="/ticketsection/due-todays-tickets"
                                component={DueTodayTickets}
                            />
                        </TabPane>
                        <TabPane tab="TAT" key="tat">
                            <Route
                                path="/ticketsection/tat-tickets"
                                component={TatTickets}
                            />
                        </TabPane>
                    </Tabs>
                </>
            </>
        )
    }

    private onTabSelect = (tab) => {
        try {
            const { history } = this.props
            switch (tab) {
                case "inProgressTickets":
                    history.push("/ticketsection/in-progress")
                    break
                case "closedTickets":
                    history.push("/ticketsection/closed-tickets")
                    break
                case "dueTickets":
                    history.push("/ticketsection/due-tickets")
                    break
                case "dueTodayTickets":
                    history.push("/ticketsection/due-todays-tickets")
                    break
                case "tat":
                    history.push("/ticketsection/tat-tickets")
                    break
                default:
                    history.push("/ticketsection/in-progress")
                    break
            }
        } catch (error) {
            console.error("Error while onTabSelect", error)
        }
    }

    private updateActivetab = (location: string) => {
        try {
            if (location.includes("in-progress")) {
                this.setState({ activeTab: "inProgressTickets" })
            } else if (location.includes("closed-tickets")) {
                this.setState({ activeTab: "closedTickets" })
            } else if (location.includes("due-tickets")) {
                this.setState({ activeTab: "dueTickets" })
            } else if (location.includes("due-todays-tickets")) {
                this.setState({ activeTab: "dueTodayTickets" })
            } else if (location.includes("tat-tickets")) {
                this.setState({ activeTab: "tat" })
            } else {
                this.setState({
                    activeTab: "inProgressTickets",
                })
            }
        } catch (error) {
            console.error("Error while updateActivetab", error)
        }
    }
}

export default connect()(TicketSection)
