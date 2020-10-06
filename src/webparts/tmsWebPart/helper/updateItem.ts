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
  etag: any;
  itemId: number;
};

/**
 * These Are Types Of Above Parameters.
 */
type updateItem = {
  url: string;
  config: SPHttpClientConfiguration;
  options: any;
};


/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL,Body(Data),List Title and Item Id Then Specific Item Will Be Updated.
 * You Can Consider This As Global Method For Update Item of SharePoint List.
 */
export const updateItemParams = ({
  absoluteUrl,
  body,
  listTitle,
  etag,
  itemId
}: ItemParam): updateItem => {
  const url = `${absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;
  const data = {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-type": "application/json;odata=verbose",
      "odata-version": "",
      "IF-MATCH": etag,
      "X-HTTP-Method": "MERGE"
    },
    body: JSON.stringify(body)
  };
  return {
    url: url,
    config: SPHttpClient.configurations.v1,
    options: data
  };
};
