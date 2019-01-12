import * as KeyConstants from '../keyConstants';

export const updateUser = (userObject) => {
    return {
        type: KeyConstants.default.UPDATE_USER_DETAILS,
        payload: userObject
    }
}

export const removeUser = () => {
    return { type: KeyConstants.default.REMOVE_USER }
}
