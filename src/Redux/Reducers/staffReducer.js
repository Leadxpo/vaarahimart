import * as actionTypes from "../Constants/staffConstant";

const initialValue = {
    loading: false,
    staffs: [],
    staff: {},
    error: ""
}

export const staffReducer = (state = initialValue, action) => {
    switch (action.type) {
        case actionTypes.FETCH_STAFFS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.FETCH_STAFFS_SUCCESS:
            if (state.staffs === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                staffs: action.payload
            }
        case actionTypes.FETCH_STAFFS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const staffDetailReducer = (state = initialValue, action) => {
    switch (action.type) {
        case actionTypes.STAFF_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.STAFF_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                staff: action.payload
            }
        case actionTypes.STAFF_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const updateStaffReducer = (state = { loading: false, staff: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_STAFF_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.UPDATE_STAFF_SUCCESS:
            return {
                ...state,
                loading: false,
                staff: action.payload
            }
        case actionTypes.UPDATE_STAFF_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}
export const createStaffReducer = (state = { loading: false, staff: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CREATE_STAFF_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_STAFF_SUCCESS:
            return {
                ...state,
                loading: false,
                staff: action.payload
            }
        case actionTypes.CREATE_STAFF_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const deleteStaffReducer = (state = { loading: false, staff: {}, error: "" }, action) => {
    switch (action.type) {
        case DELETE_STAFF_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_STAFF_SUCCESS:
            return {
                ...state,
                loading: false,
                staff: action.payload
            }
        case DELETE_STAFF_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
