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
  itemId: number;
  filters: string;
};

/**
 * These Are Types Of Above Parameters.
 */
type readItem = {
  url: string;
  config: SPHttpClientConfiguration;
  options: any;
};


/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL,Body(Data) And List Title Then Single Data Will Be Fetched From SharePoint List.
 * You Can Consider This As Global Method For Fetching Single Item From SharePoint List.
 */
export const readItemParams = ({
  absoluteUrl,
  listTitle,
  itemId,
  filters
}: ItemParam): readItem => {
  const url = `${absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})?${filters}`;
  const data = {
    headers: {
      Accept: "application/json;odata=nometadata",
      "odata-version": ""
    }
  };
  return {
    url: url,
    config: SPHttpClient.configurations.v1,
    options: data
  };
};
