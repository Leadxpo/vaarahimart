import * as actionTypes from "../Constants/categoryConstant";

const initialState = {
    loading: false,
    categories: [],
    error: ""
}

export const categorysReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_CATEGORIES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_CATEGORIES_SUCCESS:
            if (state.categories === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                categories: action.payload
            }
        case actionTypes.FETCH_CATEGORIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const limitedCategorysReducer = (state = { loading: false, limitedCategories: [], error: "" }, action) => {
    switch (action.type) {
        case actionTypes.FETCH_LIMITED_CATEGORIES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_LIMITED_CATEGORIES_SUCCESS:
            if (state.limitedCategories === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                limitedCategories: action.payload
            }
        case actionTypes.FETCH_LIMITED_CATEGORIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const categoryProductReducer = (state = { loading: false, catProducts: [], error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CATEGORY_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CATEGORY_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                catProducts: action.payload
            }
        case actionTypes.CATEGORY_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const categoryDetailReducer = (state = { loading: false, category: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CATEGORY_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CATEGORY_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                category: action.payload
            }
        case actionTypes.CATEGORY_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

