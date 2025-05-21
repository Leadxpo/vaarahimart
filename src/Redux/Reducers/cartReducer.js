import { CREATE_CARTS_REQUEST, CREATE_CARTS_SUCCESS, CREATE_REORDERED_CARTS_FAILURE,CREATE_REORDERED_CARTS_REQUEST, CREATE_REORDERED_CARTS_SUCCESS, CREATE_CARTS_FAILURE,FETCH_CART_PRODUCTS_REQUEST, FETCH_CART_PRODUCTS_SUCCESS, FETCH_CART_PRODUCTS_FAILURE,FETCH_CARTS_REQUEST, FETCH_CARTS_SUCCESS, FETCH_CARTS_FAILURE,FETCH_CARTS_DELETE,  CART_DETAIL_REQUEST, CART_DETAIL_SUCCESS, CART_DETAIL_FAIL } from "../Constants/cartConstant";
import * as actionType from "../Constants/cartConstant";
const initialValue = {
    loading: false,
    carts: [],
    error: ""
}
const cartProductValue = {
    loading: false,
    cartProducts: [],
    error: ""
}

export const createCartsReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case CREATE_CARTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_CARTS_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case CREATE_CARTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const createReorderedCartsReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case CREATE_REORDERED_CARTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_REORDERED_CARTS_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case CREATE_REORDERED_CARTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const cartsReducer = (state = initialValue, action) => {
    switch (action.type) {
        case FETCH_CARTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_CARTS_SUCCESS:
            if (state.carts === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                carts: action.payload
            }
        case FETCH_CARTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_CARTS_DELETE:

            return {
                ...state,
                loading: false,
                carts: []
            }
        default: return state
    }
}

export const cartProductsReducer = (state = cartProductValue, action) => {
    switch (action.type) {
        case FETCH_CART_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_CART_PRODUCTS_SUCCESS:
            if (state.cartProducts === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                cartProducts: action.payload
            }
        case FETCH_CART_PRODUCTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const cartDetailReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case CART_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CART_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case CART_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}


export const updateCartReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.UPDATE_CART_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.UPDATE_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case actionType.UPDATE_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deleteCartReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.DELETE_CART_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.DELETE_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case actionType.DELETE_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
export const deleteCartByVarientReducer = (state = { loading: false, cart: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.DELETE_CART_BY_VARIENT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.DELETE_CART_BY_VARIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: action.payload
            }
        case actionType.DELETE_CART_BY_VARIENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}