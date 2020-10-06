/**
 * Import React Library.
 * ! React And SharePoint Related Imports Start From Here
 */
import * as React from "react";
import * as ReactDom from "react-dom";

/**
 * Version Number Of Project
 */
import { Version } from "@microsoft/sp-core-library";

/**
 * SharePoint Propertie pen Option Imports
 */
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "TmsWebPartWebPartStrings";

/**
 * Custom CSS Import.
 * This Is SCSS File
 */
import "./styles.scss";

// Ant Design Import
import "antd/dist/antd.css";

/**
 * SP-HTTP Package Import.
 * This Package Is Used For Fetch URL Data.
 */
import { SPHttpClient } from "@microsoft/sp-http";

/**
 * Redux Store Import
 * ! Redux Store Related Imports Start From Here.
 * * We need to Create helper method.
 * @param updateUser This Action Method Update Details Of Current User.
 * @param updateAbsoluteUrl This Action Method Save URL Details.
 * @param updateSpHttpclient This Action Method Save HTTPClient Details
 * @param rightsToBoolean This Helper Method Convert String Roles Into Boolea.
 */

import store from "./Store";
import { updateUser } from "./Store/actions/login";
import {
  updateAbsoluteUrl,
  updateSpHttpClient,
} from "./Store/actions/dashboard";
import { rightsToBoolean, listTitles } from "./helper";

/**
 * Custom Component Import
 */
import TmsWebPart from "./components/TmsWebPart";

/**
 * Component Specific Props Imports
 */
import { ITmsWebPartProp } from "./Store/Types/";

export interface ITmsWebPartWebPartProps {
  description: string;
}

export default class TmsWebPartWebPart extends BaseClientSideWebPart<
  ITmsWebPartWebPartProps
> {
  public render(): void {
    // Take User Object/All Details From Current Context
    const _user = this.context.pageContext.user;

    //Redux Code Which Update User Details
    store.dispatch(
      updateUser({
        displayName: _user.displayName,
        email: _user.email,
        loginName: _user.loginName,
      })
    );

    // Redux Code Which Update Absolute URL Details
    store.dispatch(updateAbsoluteUrl(this.context.pageContext.web.absoluteUrl));

    // Redux Code Which Update SPHttp Client Details
    store.dispatch(updateSpHttpClient(this.context.spHttpClient));

    /**
     * Calling Funtion For User Authentication.
     * Set Version Of Application.
     * Pass Props To Child Component.
     */

    this.checkUserAuthorization().then(({ isAuthenticated, rights }) => {
      // Version Of WebPart Will Fetch This Code
      const manifestVersion = this.manifest.version;

      //Create New React Element And Pass Props
      const element: React.ReactElement<ITmsWebPartProp> = React.createElement(
        TmsWebPart,
        {
          absUrl: this.context.pageContext.web.absoluteUrl,
          loggedInUser: this.context.pageContext.user.displayName,
          version: manifestVersion,
          httpClient: this.context.spHttpClient,
          authorizedUser: isAuthenticated,
          rights: rights,
        } as ITmsWebPartProp
      );

      ReactDom.render(element, this.domElement);
    });
  }

  /**
   * This Method Check Is User Authentication Is Success Or Not.
   * This Method Return 2 Result.1  IsAuthenticate Or Not 2. Roles Of Logged In User
   */
  private checkUserAuthorization = async () => {
    try {
      const response = await this.context.spHttpClient.get(
        `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listTitles.USER_ROLE_TABLE}')/items?$select=*,Email/EMail&$expand=Email/EMail&$filter=Email/EMail eq '${this.context.pageContext.user.email}' and isActive eq 1`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      );

      const result = await response.json();

      //Fetch User Details From The Redux Store
      const _user = store.getState().login.user;

      // Update User Details
      store.dispatch(
        updateUser({
          ..._user,
          isAuthenticated: result.value.length ? true : false,
          rights: result.value.length
            ? rightsToBoolean(result.value[0].Rights)
            : null,
        })
      );

      return {
        isAuthenticated: result.value.length ? true : false,
        rights: result.value.length ? result.value[0].Rights : null,
      };
    } catch (error) {
      console.error("Error while checkUserAuthorization", error);
    }
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse("1.0");
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
