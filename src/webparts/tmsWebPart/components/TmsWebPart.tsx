/**
 * Import React Library.
 */
import * as React from "react"

/**
 * React Router Dom Package Import.
 * This Package Is Mainly Used For Routing Functinality.
 * @HashRouter
 * @Switch
 * @Route
 * @Redirect
 */
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"

/**
 * React Redux Package Import.
 * This Package Is Mainly Used For Global States Management/Redux In SharePoint.
 * @Provider
 *
 */
import { Provider } from "react-redux"
import store from "../Store"

/**
 * Component Specific Props File.
 */
import { ITmsWebPartProp } from "../Store/Types"

/**
 * Custom Component Import
 */

import Dashboard from "./Dashboard"
import Unauthorized from "./Unauthorized"
import { rightsToBoolean } from "../helper"

/**
 * Main Class Component.
 */
export default class TmsWebPart extends React.Component<ITmsWebPartProp, {}> {
    /**
     * Render() Method.
     * This Method Represent All The Design To End User.
     */
    public render(): React.ReactElement<ITmsWebPartProp> {
        const { version, absUrl, httpClient, loggedInUser, rights } = this.props

        return (
            <Provider store={store}>
                <HashRouter>
                    <Switch>
                        <Route
                            path="/unauthorized"
                            render={(props) => {
                                if (this.props.authorizedUser) {
                                    return <Redirect to="/" />
                                } else {
                                    return (
                                        <Unauthorized
                                            {...props}
                                            version={version}
                                        />
                                    )
                                }
                            }}
                        />

                        <Route
                            path="/"
                            render={(props) => {
                                if (this.props.authorizedUser) {
                                    return (
                                        <Dashboard
                                            {...props}
                                            version={version}
                                            absUrl={absUrl}
                                            httpClient={httpClient}
                                            loggedInUser={loggedInUser}
                                            rights={rightsToBoolean(rights)}
                                        />
                                    )
                                } else {
                                    return <Redirect to="/unauthorized" />
                                }
                            }}
                        />
                    </Switch>
                </HashRouter>
            </Provider>
        )
    }
}
