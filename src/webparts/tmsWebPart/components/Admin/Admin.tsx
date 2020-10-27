/**
 * Import React Library.
 */
import * as React from "react"

// import Users from "./Users/Users";

/**
 * React Router Dom Package Import.
 * This Package Is Mainly Used For Routing Functinality.
 * @Route
 * @Redirect
 */

import { Route } from "react-router-dom"
import { UnregisterCallback } from "history"

import { Tabs } from "antd"

const { TabPane } = Tabs

// import checklistItem from "./ChecklistItem/ChecklistItem";
import { IAdminProp } from "../../Store/Types"

/**
 * React-Redux Method Import.
 * This Function Connect Current Component With React-Redux
 */
import { connect } from "react-redux"

/**
 * Custom Component Import
 */
import Customer from "./Customer/Customer"
import Product from "./Product/Product"
import StatusType from "./StatusType/StatusType"
import Users from "./Users/Users"

/**
 * Declaring Types Of Compoent States
 */
export interface IAdminState {
    activeTab: any
}

class Admin extends React.Component<IAdminProp, IAdminState> {
    public historyListener: UnregisterCallback = null

    // Component State Section
    // ! We Need To Update Default Active Tab
    public state = {
        activeTab: "statusType",
    }

    public componentDidMount() {
        try {
            this.historyListener = this.props.history.listen((location) => {
                this.updateActivetab(location.pathname)
            })
            this.updateActivetab(this.props.location.pathname)
        } catch (error) {
            console.error(error)
        }
    }

    public componentWillUnmount() {
        if (this.historyListener) this.historyListener()
    }

    public render(): React.ReactElement<{}> {
        return (
            <>
                <Tabs
                    onChange={this.onTabSelect}
                    activeKey={this.state.activeTab}
                >
                    <TabPane tab="Users" key="users">
                        <Route path="/admin/users" component={Users} />
                    </TabPane>
                    <TabPane tab="Status Types" key="statusType">
                        <Route
                            path="/admin/status-type"
                            component={StatusType}
                        />
                    </TabPane>
                    <TabPane tab="Product Information" key="productInformation">
                        <Route
                            path="/admin/product-information"
                            component={Product}
                        />
                    </TabPane>
                    <TabPane
                        tab="Customer Information"
                        key="customerInformation"
                    >
                        <Route
                            path="/admin/customer-information"
                            component={Customer}
                        />
                    </TabPane>
                </Tabs>
            </>
        )
    }

    private onTabSelect = (tab) => {
        try {
            const { history } = this.props
            this.setState({ activeTab: tab })

            switch (tab) {
                case "users":
                    history.push("/admin/users")
                    break
                case "statusType":
                    history.push("/admin/status-type")
                    break
                case "productInformation":
                    history.push("/admin/product-information")
                    break
                case "customerInformation":
                    history.push("/admin/customer-information")
                    break
                default:
                    history.push("/admin/status-type")
                    break
            }
        } catch (error) {
            console.error("Error while onTabSelect", error)
        }
    }

    private updateActivetab = (location: string) => {
        try {
            if (location.includes("status-type")) {
                this.setState({ activeTab: "statusType" })
            } else if (location.includes("product-information")) {
                this.setState({ activeTab: "productInformation" })
            } else if (location.includes("customer-information")) {
                this.setState({ activeTab: "customerInformation" })
            } else if (location.includes("users")) {
                this.setState({ activeTab: "users" })
            } else {
                this.setState({
                    activeTab: "statusType",
                })
            }
        } catch (error) {
            console.error("Error while updateActivetab", error)
        }
    }
}

export default connect()(Admin)
