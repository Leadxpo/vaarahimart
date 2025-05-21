import * as actionTypes from "../Constants/promoConstant";

const initialState = {
    loading: false,
    promos: [],
    error: ""
}

export const promosReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PROMOS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_PROMOS_SUCCESS:
            if (state.promos === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                promos: action.payload
            }
        case actionTypes.FETCH_PROMOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const promoDetailReducer = (state = { loading: false, promo: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.PROMO_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.PROMO_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                promo: action.payload
            }
        case actionTypes.PROMO_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}
