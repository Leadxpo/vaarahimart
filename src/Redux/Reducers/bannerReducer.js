import * as actionTypes from "../Constants/bannerConstant";

const initialState = {
    loading: false,
    banners: [],
    error: ""
}

export const bannersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_BANNERS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_BANNERS_SUCCESS:
            if (state.banners === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                banners: action.payload
            }
        case actionTypes.FETCH_BANNERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const bannerDetailReducer = (state = { loading: false, banner: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.BANNER_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.BANNER_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                banner: action.payload
            }
        case actionTypes.BANNER_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}
