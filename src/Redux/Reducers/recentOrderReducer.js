import * as actionTypes from "../Constants/recentOrderConstant";

const initialValue = {
    loading: false,
    recent_orders: [],
    recent_order: {},
    error: ""
}

export const recent_ordersReducer = (state = initialValue, action) => {
    switch (action.type) {
        case actionTypes.FETCH_RECENT_ORDERS_REQUEST:
            return { 
                ...state,
                loading: true,
            }
        case actionTypes.FETCH_RECENT_ORDERS_SUCCESS:
            if (state.recent_orders === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                recent_orders: action.payload
            }
        case actionTypes.FETCH_RECENT_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.FETCH_RECENT_ORDERS_DELETE:
            return {
                ...state,
                loading: false,
                recent_orders: []
            }
        default: return state
    }

}

export const recent_orderDetailReducer = (state = initialValue, action) => {
    switch (action.type) {
        case actionTypes.RECENT_ORDER_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.RECENT_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                recent_order: action.payload
            }
        case actionTypes.RECENT_ORDER_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const updateRecent_orderReducer = (state = { loading: false, recent_order: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_RECENT_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.UPDATE_RECENT_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                recent_order: action.payload
            }
        case actionTypes.UPDATE_RECENT_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}
