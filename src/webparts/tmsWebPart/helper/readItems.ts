/**
 * Parameters For CreateItemParams Method
 */
import { SPHttpClientConfiguration, SPHttpClient } from "@microsoft/sp-http"

/**
 * These Are Types Of Above Parameters.
 */
type ItemParam = {
    absoluteUrl: string
    listTitle: string
    filters: string
}

/**
 * These Are Types Of Above Parameters.
 */
type readItems = {
    url: string
    config: SPHttpClientConfiguration
    options: any
}

/**
 * This Is Re-Usable Method.
 * Developer Needs To Only Pass URL,Body(Data) And List Title Then All Data Will Be Fetched From SharePoint List.
 * You Can Consider This As Global Method For Fetching All Items From SharePoint List.
 */

export const readItemsParams = ({
    absoluteUrl,
    listTitle,
    filters,
}: ItemParam): readItems => {
    const url = `${absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items?${filters}`
    const data = {
        headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
        },
    }
    return {
        url: url,
        config: SPHttpClient.configurations.v1,
        options: data,
    }
}
