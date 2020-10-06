export const types = {
    UPDATE_ABSOLUTE_URL: "UPDATE_ABSOLUTE_URL",
    UPDATE_ACTIVE_TAB: "UPDATE_ACTIVE_TAB",
    UPDATE_SP_HTTP_CLIENT: "UPDATE_SP_HTTP_CLIENT",
}

export const updateAbsoluteUrl = (payload) => {
    return {
        type: types.UPDATE_ABSOLUTE_URL,
        payload,
    }
}

export const updateActiveTab = (payload) => {
    return {
        type: types.UPDATE_ACTIVE_TAB,
        payload,
    }
}

export const updateSpHttpClient = (payload) => {
    return {
        type: types.UPDATE_SP_HTTP_CLIENT,
        payload,
    }
}
