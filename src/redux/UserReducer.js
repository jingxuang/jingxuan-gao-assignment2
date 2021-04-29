import * as ActionTypes from './ActionTypes';

export const UserReducer = (state = {
    username: '',
    token: '',
    isLogin: false
}, action) => {
    switch(action.type) {
        case ActionTypes.LOGIN: 
            return {
                username: action.username,
                token: action.token,
                isLogin: true
            }
        case ActionTypes.LOGOUT:
            return {
                username: '',
                token: '',
                isLogin: false
            }
        default:
            return state;
    }
}