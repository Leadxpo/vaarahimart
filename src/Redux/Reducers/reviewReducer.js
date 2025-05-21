import * as actionTypes from "../Constants/reviewConstant";

const initialState = {
    loading: false,
    reviews: [],
    error: ""
}

export const createReviewReducer = (state = { loading: false, review: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CREATED_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATED_REVIEW_SUCCESS:
            if (state.review === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                reviews: action.payload
            }
        case actionTypes.CREATED_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.GET_REVIEWS_SUCCESS:
            if (state.reviews === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                reviews: action.payload
            }
        case actionTypes.GET_REVIEWS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const singleReviewReducer = (state = { loading: false, review: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.REVIEW_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.REVIEW_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                review: action.payload
            }
        case actionTypes.REVIEW_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}