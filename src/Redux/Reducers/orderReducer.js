import { CREATE_ORDERS_REQUEST, CREATE_ORDERS_SUCCESS, CREATE_ORDERS_FAILURE, FETCH_ASSIGNED_ORDERS_REQUEST, FETCH_ASSIGNED_ORDERS_SUCCESS, FETCH_ASSIGNED_ORDERS_FAILURE, FETCH_ASSIGNED_ORDERS_DELETE, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS, ORDER_DETAIL_FAIL } from "../Constants/orderConstant";
import * as actionType from "../Constants/orderConstant";
const initialValue = {
    loading: false,
    orders: [],
    error: ""
}
const assignedValue = {
    loading: false,
    assignedOrders: [],
    error: ""
}

export const createOrdersReducer = (state = { loading: false, order: {}, error: "" }, action) => {
    switch (action.type) {
        case CREATE_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            }
        case CREATE_ORDERS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const ordersReducer = (state = initialValue, action) => {
    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_ORDERS_SUCCESS:
            if (state.orders === action.payload) {
                return state;  // No state change if the array is the same
            }
            return {
                ...state,
                loading: false,
                orders: action.payload
            }
        case FETCH_ORDERS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const assignedOrdersReducer = (state = assignedValue, action) => {
    switch (action.type) {
        case FETCH_ASSIGNED_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_ASSIGNED_ORDERS_SUCCESS:
            if (state.orders === action.payload) {
                return state;  // No state change if the array is the same
            }
            return {
                ...state,
                loading: false,
                assignedOrders: action.payload
            }
        case FETCH_ASSIGNED_ORDERS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_ASSIGNED_ORDERS_DELETE:

            return {
                ...state,
                loading: false,
                assignedOrders: []
            }
        default: return state
    }
}

export const orderDetailReducer = (state = { loading: false, order: {}, error: "" }, action) => {
    switch (action.type) {
        case ORDER_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            }
        case ORDER_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}


export const updateOrderReducer = (state = { loading: false, order: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.UPDATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            }
        case actionType.UPDATE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deleteOrderReducer = (state = { loading: false, order: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            }
        case actionType.DELETE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}