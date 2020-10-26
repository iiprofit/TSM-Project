import { SPHttpClient } from "@microsoft/sp-http"
import { Params } from "."

export interface IUploadAttachment {
    absoluteUrl: string
    listTitle: string
    itemId: number
    fileName: string
    buffer: ArrayBuffer
}

export const uploadAttachmentParams = (param: IUploadAttachment): Params => {
    const url = `${param.absoluteUrl}/_api/web/lists/getbytitle('${param.listTitle}')/items(${param.itemId})/AttachmentFiles/add(FileName='${param.fileName}')`

    const data = {
        headers: {
            Accept: "application/json;odata=verbose",
            "Content-type": "application/json;odata=verbose",
            "odata-version": "",
            "content-length": param.buffer.byteLength,
        },
        body: param.buffer,
    }

    return {
        url: url,
        config: SPHttpClient.configurations.v1,
        options: data,
    }
}

export interface IDeleteAttachment {
    absoluteUrl: string
    listTitle: string
    itemId: number
    fileName: string
}

export const deleteAttachmentParams = (param: IDeleteAttachment): Params => {
    const url = `${param.absoluteUrl}/_api/web/lists/GetByTitle('${param.listTitle}')/GetItemById(${param.itemId})/AttachmentFiles/getByFileName('${param.fileName}')`

    const data = {
        headers: {
            Accept: "application/json;odata=verbose",
            "Content-type": "application/json;odata=verbose",
            "X-HTTP-Method": "DELETE",
        },
    }

    return {
        url: url,
        config: SPHttpClient.configurations.v1,
        options: data,
    }
}

export interface IFetchAttachments {
    absoluteUrl: string
    listTitle: string
    itemId: number
}

export const fetchAttachmentsParams = (param: IFetchAttachments): Params => {
    const url = `${param.absoluteUrl}/_api/web/lists/getbytitle('${param.listTitle}')/items(${param.itemId})/AttachmentFiles?$select=*,FileLeafRef,EncodedAbsUrl`

    const data = {
        headers: {
            Accept: "application/json;odata.metadata=minimal",
            "Content-type": "application/json;odata.metadata=minimal",
        },
    }

    return {
        url: url,
        config: SPHttpClient.configurations.v1,
        options: data,
    }
}
