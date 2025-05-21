import * as actionTypes from "../Constants/imageCountConstant";

const initialState = {
    loading: false,
    imageCounts: 0,
    error: ""
}

export const imageCountsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IMAGE_COUNT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.IMAGE_COUNT_SUCCESS:
            if (state.imageCounts === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                imageCounts: action.payload
            }
        case actionTypes.IMAGE_COUNT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

