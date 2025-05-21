import * as actionTypes from "../Constants/requestConstant";

const initialState = {
    loading: false,
    requests: [],
    error: ""
}
const pendingState = {
    loading: false,
    pendingRequests: [],
    error: ""
}

export const requestReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_REQUESTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_REQUESTS_SUCCESS:
            if (state.requests === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                requests: action.payload
            }
        case actionTypes.FETCH_REQUESTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const pendingRequestReducer = (state = pendingState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PENDING_REQUESTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_PENDING_REQUESTS_SUCCESS:
            if (state.requests === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                pendingRequests: action.payload
            }
        case actionTypes.FETCH_PENDING_REQUESTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actionTypes.FETCH_PENDING_REQUESTS_REQUEST:
            return {
                ...state,
                loading: false,
                pendingRequests: []
            }
        default: return state
    }
}

export const requestDetailReducer = (state = { loading: false, request: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.REQUEST_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.REQUEST_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                request: action.payload
            }
        case actionTypes.REQUEST_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

export const updateRequestReducer = (state = { loading: false, request: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_REQUEST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                request: action.payload
            }
        case actionTypes.UPDATE_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

export const createRequestReducer = (state = { loading: false, request: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CREATE_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                request: action.payload
            }
        case actionTypes.CREATE_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const deleteRequestReducer = (state = { loading: false, request: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.DELETE_REQUEST_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                request: action.payload
            }
        case actionTypes.DELETE_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
