/**
 * SPHttp Package Import.
 * Both Packages Are Used For Configuration.
 *
 */
import { SPHttpClient } from "@microsoft/sp-http"
import { Params } from "."
/**
 * Parameters For CreateItemParams Method
 */
export interface ICreateItem {
    absoluteUrl: string
    listTitle: string
    body: any
}

/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL,Body(Data) And List Title Then That Data Will Be Added Into SharePoint List.
 * You Can Consider This As Global Method For Inserting Data Into SharePoint List.
 */
export const createItemParams = (param: ICreateItem): Params => {
    const url = `${param.absoluteUrl}/_api/web/lists/getbytitle('${param.listTitle}')/items`
    const data = {
        headers: {
            accept: "application/json;odata=nometadata",
            "content-type": "application/json;odata=verbose",
            "odata-version": "",
        },
        body: JSON.stringify(param.body),
    }
    return {
        url: url,
        config: SPHttpClient.configurations.v1,
        options: data,
    }
}
