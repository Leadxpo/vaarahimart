import * as actionTypes from "../Constants/notificationConstant";

const initialState = {
    loading: false,
    notifications: [], 
    error: ""
}
const staffState = {
    loading: false,
    staffNotifications: [], 
    error: ""
}

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.GET_NOTIFICATIONS_SUCCESS:
            if (state.notifications === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                notifications: action.payload
            }
        case actionTypes.GET_NOTIFICATIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
export const staffNotificationReducer = (state = staffState, action) => {
    switch (action.type) {
        case actionTypes.GET_STAFF_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.GET_STAFF_NOTIFICATIONS_SUCCESS:
            if (state.notifications === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                staffNotifications: action.payload
            }
        case actionTypes.GET_STAFF_NOTIFICATIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.GET_STAFF_NOTIFICATIONS_DELETE:
            return {
                ...state,
                loading: false,
                staffNotifications: []
            }
        default: return state
    }
}

export const singleNotificationReducer = (state = { loading: false, notification: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.NOTIFICATION_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.NOTIFICATION_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                notification: action.payload
            }
        case actionTypes.NOTIFICATION_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}