/**
 * React Router Dom Package Import.
 * @RouterComponentProps
 * @match
 */
import { RouteComponentProps, match } from "react-router-dom"

/**
 * SP-HTTP Package Import.
 * This Package Is Used For Fetch URL Data.
 */
import { SPHttpClient } from "@microsoft/sp-http"

/**
 * User Role Fetching
 */
import { rightsBoolean } from "../../helper"

import { User } from "../reducers/login"

interface CommonProps {
    absUrl: string
    httpClient?: SPHttpClient
    user?: User
}

export interface IDashboardProp extends RouteComponentProps, CommonProps {
    loggedInUser: string
    version: string
    activeTab?: string
    isLoading?: boolean
    rights: rightsBoolean
    onUpdateAbsoluteUrl?: (absUrl: string) => any
    onUpdateSpHttpClient?: (httpClient: SPHttpClient) => any
    onTabSelect?: (activeTab) => any
}

export interface ITmsWebPartProp extends RouteComponentProps, CommonProps {
    loggedInUser?: string
    version: string
    authorizedUser: boolean
    rights: string
    onUpdateAbsoluteUrl?: (absoluteUrl: string) => any
}

// UnAuthorized Section Props
export interface IUnauthorizedProp extends RouteComponentProps, CommonProps {
    version: string
}

// Loading Sections Props
export interface ILoadingProp {}

/**
 * * Admin Section Props Start
 */
export interface IAdminProp extends RouteComponentProps, CommonProps {}

//User's Section Props Start
export interface IAddUserProp extends RouteComponentProps, CommonProps {}
export interface IEditUserProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}
export interface IUsersProp extends RouteComponentProps, CommonProps {}

//Status Type's Section Props Start
export interface IStatusTypeProp extends RouteComponentProps, CommonProps {}
export interface IAddStatusTypeProp extends RouteComponentProps, CommonProps {}
export interface IEditStatusTypeProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}

//Product Information's Section Props Start
export interface IProductProp extends RouteComponentProps, CommonProps {}
export interface IAddProductProp extends RouteComponentProps, CommonProps {}
export interface IEditProductProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}

//Customer's Section Props Start
export interface ICustomerProp extends RouteComponentProps, CommonProps {}
export interface IAddCustomerProp extends RouteComponentProps, CommonProps {}
export interface IEditCustomerProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}
/**
 * * Admin Section Props End
 */

/**
 * * Ticket Section Props Start
 */
export interface ITicketSectionProp extends RouteComponentProps, CommonProps {}

// In-Progress Sections's Props
export interface IInProgressTicketsProp
    extends RouteComponentProps,
        CommonProps {}
export interface IAddInProgressTicketsProp
    extends RouteComponentProps,
        CommonProps {}
export interface IEditInProgressTicketsProp
    extends RouteComponentProps,
        CommonProps {
    match: match<{
        id: string
    }>
}

// Cloesd Sections's Props
export interface IClosedTicketsProp extends RouteComponentProps, CommonProps {}
export interface IAddClosedTicketsProp
    extends RouteComponentProps,
        CommonProps {}
export interface IEditClosedTicketsProp
    extends RouteComponentProps,
        CommonProps {
    match: match<{
        id: string
    }>
}

// Due Section's Props
export interface IDueTicketsProp extends RouteComponentProps, CommonProps {}
export interface IAddDueTicketsProp extends RouteComponentProps, CommonProps {}
export interface IEditDueTicketsProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}

// Due-Today Section's Props
export interface IDueTodaysTicketsProp
    extends RouteComponentProps,
        CommonProps {}
export interface IAddDueTodaysTicketsProp
    extends RouteComponentProps,
        CommonProps {}
export interface IEditDueTodaysTicketsProp
    extends RouteComponentProps,
        CommonProps {
    match: match<{
        id: string
    }>
}
// TAT Sections's Props
export interface ITatTicketsProp extends RouteComponentProps, CommonProps {}
export interface IAddTatTicketsProp extends RouteComponentProps, CommonProps {}
export interface IEditTatTicketsProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}

//New Ticket Section's Props
export interface INewTicketProp extends RouteComponentProps, CommonProps {
    mode?: string
    match: match<{
        id?: string
    }>
}
//Edit Ticket Section's Props
export interface IEditTicketProp extends RouteComponentProps, CommonProps {
    match: match<{
        id: string
    }>
}

/**
 * * Ticket Section Props End
 */

/**
 * *  Search Section Props Start
 */
export interface ISearchTicketsProp extends RouteComponentProps, CommonProps {}
/**
 * *  Search Section Props End
 */
