// Import GUID List Helper File
export * from "./listGUIDs"
export * from "./createItem"
export * from "./readItem"
export * from "./readItems"
export * from "./sendEmail"
export * from "./updateItem"

// Types For rightsToBoolean()
export type rightsBoolean = {
    admin: boolean
    approve: boolean
    ccs: boolean
    downloadHistory: boolean
}

/**
 * This Method Accept Rights as a Params and Convert into into booleans.
 * Basically it Convert Multiple String Value into Boolean
 * @param rights
 */
export const rightsToBoolean = (rights: string): rightsBoolean => {
    let _rights: Array<any> = rights && rights.split(",")
    return rights
        ? ({
              admin: _rights.indexOf("admin") === -1 ? false : true,
              approve: _rights.indexOf("approve") === -1 ? false : true,
              ccs: _rights.indexOf("ccs") === -1 ? false : true,
              downloadHistory:
                  _rights.indexOf("downloadHistory") === -1 ? false : true,
          } as rightsBoolean)
        : { admin: false, approve: false, ccs: false, downloadHistory: false }
}
