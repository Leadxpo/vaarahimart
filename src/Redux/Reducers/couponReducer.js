import * as actionTypes from "../Constants/couponConstant";

const initialState = {
    loading: false,
    coupons: [],
    error: ""
}

export const couponsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_COUPONS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_COUPONS_SUCCESS:
            if (state.coupons === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                coupons: action.payload
            }
        case actionTypes.FETCH_COUPONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const couponDetailReducer = (state = { loading: false, coupon: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.COUPON_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.COUPON_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                coupon: action.payload
            }
        case actionTypes.COUPON_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}
