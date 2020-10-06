export const types = {
    UPDATE_IS_LOADING: "UPDATE_IS_LOADING",
}

export const updateIsLoading = (payload) => {
    return {
        type: types.UPDATE_IS_LOADING,
        payload,
    }
}
