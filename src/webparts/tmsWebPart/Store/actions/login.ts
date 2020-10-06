export const types = {
    UPDATE_USER: "UPDATE_USER"
  };
  
  export const updateUser = payload => {
    return {
      type: types.UPDATE_USER,
      payload
    };
  };
  