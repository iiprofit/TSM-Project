/**
 * Import React Library.
 */
import * as React from "react"

/**
 * React Router Dom Package Import.
 * This Package Is Mainly Used For Routing Functinality.
 * @Route
 * @Redirect
 */
import { Route, Redirect } from "react-router-dom"

import { Tabs, Row, Col } from "antd"

const { TabPane } = Tabs

/**
 * React-Redux Method Import.
 * This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"
import { UnregisterCallback } from "history"

/**
 * Current Component Props Import From Global Props Location.
 */
import { IDashboardProp } from "../Store/Types"
import { AppState } from "../Store/reducers"

/**
 * Custom Component Imports
 */
import Admin from "./Admin/Admin"
import SearchTickets from "./SearchSection/SearchTickets"
import TicketSection from "./TicketSection/TicketSection"
// Ticket
// import ClosedTickets from "./TicketSection/ClosedTickets";
// import DueTickets from "./DueTickets/DueTickets";
import DueTodayTickets from "./TicketSection/DueTodayTicket/DueTodayTickets"
// import InProgrssTickets from "./InProgressTickets/InProgressTickets";
import NewTicket from "./TicketSection/NewTicket/NewTicket"
import EditTicket from "./TicketSection/EditTicket/EditTicket"
import AddCustomer from "./Admin/Customer/AddCustomer"
import EditCustomer from "./Admin/Customer/EditCustomer"
import AddProduct from "./Admin/Product/AddProduct"
import EditProduct from "./Admin/Product/EditProduct"
import AddStatusType from "./Admin/StatusType/AddStatusType"
import EditStatusType from "./Admin/StatusType/EditStatusType"
import AddUser from "./Admin/Users/AddUser"
import EditUser from "./Admin/Users/EditUser"
import * as helper from "../helper"

/**
 * Declaring Types Of Compoent States
 */
type IDashboardState = {
    activeTab: any
    routeDisplayName: string
}

class Dashboard extends React.Component<IDashboardProp, IDashboardState> {
    // Component State Section
    // ! We Need To Update Default Active Tab
    public state: IDashboardState = {
        activeTab: "",
        routeDisplayName: null,
    }

    public historyListener: UnregisterCallback = null

    // Component Did Mount Method
    public componentDidMount() {
        try {
            this.historyListener = this.props.history.listen((location) => {
                this.updateActivetab(location.pathname)
                this.updateRouteDisplayName(location.pathname)
            })
            this.updateActivetab(this.props.location.pathname)
            this.updateRouteDisplayName(location.pathname)
        } catch (error) {
            console.error(error)
        }
    }

    // Component Will Mount Method
    public componentWillUnmount() {
        try {
            if (this.historyListener) this.historyListener()
        } catch (error) {
            console.error(error)
        }
    }

    // Render() For HTML Representation.

    public render(): React.ReactElement {
        /**
         * Desctructuring Of States And Props
         */
        const { activeTab } = this.state
        const { rights, isLoading } = this.props
        return (
            <>
                <div style={{ border: `1px solid darken(#e6e6e6,15%)` }}>
                    <Row>
                        <Col span={12}>
                            <h2>{this.getTitle()}</h2>
                        </Col>
                        <Col span={12}>
                            <div>
                                <p style={{ textAlign: "right" }}>
                                    {this.props.loggedInUser}
                                </p>
                                <p style={{ textAlign: "right" }}>
                                    Version : {this.props.version}
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Tabs onChange={this.onTabSelect} activeKey={activeTab}>
                        <TabPane tab="Ticket Section" key="ticketsection">
                            <Route
                                path="/ticketsection"
                                component={TicketSection}
                            />
                            <Route
                                path="/new-ticket"
                                component={(props) => (
                                    <NewTicket
                                        {...props}
                                        mode={helper.Modes.Add}
                                    />
                                )}
                            />
                            <Route
                                path="/edit-ticket/:id"
                                component={(props) => (
                                    <NewTicket
                                        {...props}
                                        mode={helper.Modes.Edit}
                                    />
                                )}
                            />
                        </TabPane>
                        <TabPane tab="Search Section" key="searchsection">
                            <Route
                                path="/search-section"
                                component={SearchTickets}
                            />
                        </TabPane>
                        {rights.admin && (
                            <TabPane tab="Admin" key="admin">
                                <Route path="/admin" component={Admin} />
                                <Route
                                    path="/new-customer"
                                    component={AddCustomer}
                                />
                                <Route
                                    path="/edit-customer/:id"
                                    component={EditCustomer}
                                />
                                <Route
                                    path="/new-product"
                                    component={AddProduct}
                                />
                                <Route
                                    path="/edit-product/:id"
                                    component={EditProduct}
                                />
                                <Route
                                    path="/new-status"
                                    component={AddStatusType}
                                />
                                <Route
                                    path="/edit-status/:id"
                                    component={EditStatusType}
                                />
                                <Route path="/new-user" component={AddUser} />
                                <Route
                                    path="/edit-user/:id"
                                    component={EditUser}
                                />
                            </TabPane>
                        )}
                    </Tabs>
                </div>
            </>
        )
    }

    private getTitle() {
        if (this.state.routeDisplayName) {
            return `TMS System - ${this.state.routeDisplayName}`
        } else return "TMS System"
    }

    private updateRouteDisplayName(location: string) {
        let title = null
        switch (location) {
            case "":
                title = ""
                break
            default:
                title = null
                break
        }
        this.setState({ routeDisplayName: title })
    }

    /**
     *  This Function Redirect User On Selected Tab.
     * @param tab This is Selected Tab Value.
     * ! We Need To change Paths
     */
    private onTabSelect = (tab) => {
        try {
            const { history } = this.props
            switch (tab) {
                case "ticketsection":
                    history.push("/ticketsection/in-progress")
                    this.setState({ activeTab: "ticketsection" })
                    break
                case "searchsection":
                    history.push("/search-section")
                    this.setState({ activeTab: "searchsection" })
                    break
                case "admin":
                    history.push("/admin/users")
                    this.setState({ activeTab: "admin" })
                    break
                default:
                    history.push("/ticketsection/in-progress")
                    this.setState({ activeTab: "ticketsection" })
                    break
            }
        } catch (error) {
            console.error("Error while onTabSelect", error)
        }
    }

    /**
     * This Function Uppdate State Which Store Active Location.
     * @param location Current Tab Location.
     */
    private updateActivetab = (location: string) => {
        try {
            let _admin = [
                "release",
                "checklist",
                "user",
                "customer",
                "product",
                "status",
            ]
            if (location === "/") {
                this.props.history.push("/ticketsection/in-progress")
            } else if (
                location.includes("/admin") ||
                _admin.filter((x) => location.includes(x)).length
            ) {
                this.setState({ activeTab: "admin" })
            } else if (location.includes("/search-section")) {
                this.setState({ activeTab: "searchsection" })
            } else {
                this.setState({
                    activeTab: "ticketsection",
                })
            }
        } catch (error) {
            console.error("Error while updateActivetab", error)
        }
    }
}

/**
 * Redux Map Funtion Which Map Global Store's State To Props Of Current Component.
 */
const mapStateToProps = (state) => ({
    isLoading: state.loading.isLoading,
})

/**
 * This Funtion Export Component As Well As Connect Current Component With Redux
 */
export default connect(mapStateToProps)(Dashboard)
