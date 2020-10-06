/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 * 
 */
import { SPHttpClientConfiguration, SPHttpClient } from "@microsoft/sp-http";

/**
 * Parameters For CreateItemParams Method
 */
type ItemParam = {
  absoluteUrl: string;
  listTitle: string;
  body: any;
};

/**
 * These Are Types Of Above Parameters.
 */
type createItem = {
  url: string;
  config: SPHttpClientConfiguration;
  options: any;
};

/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL,Body(Data) And List Title Then That Data Will Be Added Into SharePoint List.
 * You Can Consider This As Global Method For Inserting Data Into SharePoint List.
 */
export const createItemParams = ({
    absoluteUrl,
    body,
    listTitle
  }: ItemParam): createItem => {
    const url = `${absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items`;
    const data = {
      headers: {
        accept: "application/json;odata=nometadata",
        "content-type": "application/json;odata=verbose",
        "odata-version": ""
      },
      body: JSON.stringify(body)
    };
    return {
      url: url,
      config: SPHttpClient.configurations.v1,
      options: data
    };
  };
  