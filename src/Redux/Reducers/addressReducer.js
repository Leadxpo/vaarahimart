import { CREATE_ADDRESSES_REQUEST, CREATE_ADDRESSES_SUCCESS, CREATE_ADDRESSES_FAILURE,FETCH_ADDRESSES_REQUEST, FETCH_ADDRESSES_SUCCESS, FETCH_ADDRESSES_FAILURE,FETCH_ADDRESSES_DELETE,  ADDRESS_DETAIL_REQUEST, ADDRESS_DETAIL_SUCCESS, ADDRESS_DETAIL_FAIL } from "../Constants/addressConstant";
import * as actionType from "../Constants/addressConstant";
const initialValue = {
    loading: false,
    addresses: [],
    error: ""
}

export const createAddressReducer = (state = { loading: false, address: {}, error: "" }, action) => {
    switch (action.type) {
        case CREATE_ADDRESSES_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_ADDRESSES_SUCCESS:
            return {
                ...state,
                loading: false,
                address: action.payload
            }
        case CREATE_ADDRESSES_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
export const addressesReducer = (state = initialValue, action) => {
    switch (action.type) {
        case FETCH_ADDRESSES_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_ADDRESSES_SUCCESS:
            if (state.addresses === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                addresses: action.payload
            }
        case FETCH_ADDRESSES_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_ADDRESSES_DELETE:

            return {
                ...state,
                loading: false,
                addresses: []
            }
        default: return state
    }
}

export const addressDetailReducer = (state = { loading: false, address: {}, error: "" }, action) => {
    switch (action.type) {
        case ADDRESS_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ADDRESS_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                address: action.payload
            }
        case ADDRESS_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}


export const updateAddressReducer = (state = { loading: false, address: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.UPDATE_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                address: action.payload
            }
        case actionType.UPDATE_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deleteAddressReducer = (state = { loading: false, address: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.DELETE_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                address: action.payload
            }
        case actionType.DELETE_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}