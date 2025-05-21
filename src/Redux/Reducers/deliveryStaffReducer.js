import {
    GET_DELIVERYSTAFFS_REQUEST,
    GET_DELIVERYSTAFFS_SUCCESS,
    GET_DELIVERYSTAFFS_FAILURE,
    DELIVERYSTAFF_DETAIL_SUCCESS,
    DELIVERYSTAFF_DETAIL_FAIL,
    DELIVERYSTAFF_DETAIL_REQUEST,
    DELIVERYSTAFF_DETAIL_DELETE,
    UPDATE_DELIVERYSTAFF_FAIL,
    UPDATE_DELIVERYSTAFF_REQUEST,
    UPDATE_DELIVERYSTAFF_SUCCESS,
    UPDATE_DELIVERYSTAFFDP_FAIL,
    UPDATE_DELIVERYSTAFFDP_REQUEST,
    UPDATE_DELIVERYSTAFFDP_SUCCESS,
    DELETE_DELIVERYSTAFF_REQUEST,
    DELETE_DELIVERYSTAFF_SUCCESS,
    DELETE_DELIVERYSTAFF_FAIL
} from "../Constants/deliveryStaffConstant";

const initialState = {
    loading: false,
    deliveryStaffs: [],
    error: "",
    deliveryStaff: {},
}

export const deliveryStaffReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DELIVERYSTAFFS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_DELIVERYSTAFFS_SUCCESS:
            if (state.deliveryStaffs === action.payload) {
                return state;  // No state change if the array is the same
            }
            return {
                ...state,
                loading: false,
                deliveryStaffs: action.payload
            }
        case GET_DELIVERYSTAFFS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deliveryStaffDetailReducer = (state = { loading: false, deliveryStaffInfo: {}, error: "" }, action) => {
    switch (action.type) {
        case DELIVERYSTAFF_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELIVERYSTAFF_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveryStaffInfo: action.payload
            }
        case DELIVERYSTAFF_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELIVERYSTAFF_DETAIL_DELETE:
            return {
                ...state,
                loading: false,
                deliveryStaffInfo:{}
            }
        default: return state
    }
}

export const updateDeliveryStaffReducer = (state = { loading: false, deliveryStaff: {}, error: "" }, action) => {
    switch (action.type) {
        case UPDATE_DELIVERYSTAFF_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_DELIVERYSTAFF_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveryStaff: action.payload
            }
        case UPDATE_DELIVERYSTAFF_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const updateDeliveryStaffDPReducer = (state = { loading: false, deliveryStaff: {}, error: "" }, action) => {
    switch (action.type) {
        case UPDATE_DELIVERYSTAFFDP_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_DELIVERYSTAFFDP_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveryStaff: action.payload
            }
        case UPDATE_DELIVERYSTAFFDP_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deleteDeliveryStaffReducer = (state = { loading: false, deliveryStaff: {}, error: "" }, action) => {
    switch (action.type) {
        case DELETE_DELIVERYSTAFF_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_DELIVERYSTAFF_SUCCESS:
            return {
                ...state,
                loading: false,
                deliveryStaff: action.payload
            }
        case DELETE_DELIVERYSTAFF_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}