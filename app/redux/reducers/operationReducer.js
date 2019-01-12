import * as KeyConstants from '../keyConstants';

const initialState = {
    userData: []
};

const operationReducer = (state = initialState, action) => {
    switch (action.type) {
        case KeyConstants.default.UPDATE_USER_DETAILS: {
            let userData = state.userData.slice();
            userData.push(action.payload);
            return { ...state, userData };
        }
        case KeyConstants.default.REMOVE_USER: {
            let userData = state.userData.slice();
            userData = [];
            return { ...state, userData };
        }
        default:
            return state;
    }
}

export default operationReducer;