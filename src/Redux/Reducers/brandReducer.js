import * as actionTypes from "../Constants/brandConstant";

const initialState = {
    loading: false,
    brands: [],
    error: ""
}

export const brandsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_BRANDS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_BRANDS_SUCCESS:
            if (state.brands === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                brands: action.payload
            }
        case actionTypes.FETCH_BRANDS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const limitedBrandsReducer = (state =  { loading: false, limitedbrands: [], error: "" }, action) => {
    switch (action.type) {
        case actionTypes.FETCH_LIMITED_BRANDS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_LIMITED_BRANDS_SUCCESS:
            if (state.brands === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                limitedbrands: action.payload
            }
        case actionTypes.FETCH_LIMITED_BRANDS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const brandProductReducer = (state = { loading: false, brandProducts: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.BRAND_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.BRAND_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                catProducts: action.payload
            }
        case actionTypes.BRAND_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const brandDetailReducer = (state = { loading: false, brand: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.BRAND_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.BRAND_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                brand: action.payload
            }
        case actionTypes.BRAND_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

