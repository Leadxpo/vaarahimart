import { CREATE_WISHLISTS_REQUEST, CREATE_WISHLISTS_SUCCESS, CREATE_WISHLISTS_FAILURE,FETCH_WISHLISTS_REQUEST, FETCH_WISHLISTS_SUCCESS, FETCH_WISHLISTS_FAILURE,FETCH_WISHLISTS_DELETE, WISHLIST_DETAIL_REQUEST, WISHLIST_DETAIL_SUCCESS, WISHLIST_DETAIL_FAIL } from "../Constants/wishlistConstant";
import * as actionType from "../Constants/wishlistConstant";
const initialValue = {
    loading: false,
    wishlists: [],
    error: ""
}

export const createWishlistsReducer = (state = { loading: false, wishlist: {}, error: "" }, action) => {
    switch (action.type) {
        case CREATE_WISHLISTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case CREATE_WISHLISTS_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: action.payload
            }
        case CREATE_WISHLISTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const wishlistsReducer = (state = initialValue, action) => {
    switch (action.type) {
        case FETCH_WISHLISTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case FETCH_WISHLISTS_SUCCESS:
            if (state.wishlists === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                wishlists: action.payload
            }
        case FETCH_WISHLISTS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case FETCH_WISHLISTS_DELETE:

            return {
                ...state,
                loading: false,
                wishlists:[]
            }
        default: return state
    }
}

export const wishlistDetailReducer = (state = { loading: false, wishlist: {}, error: "" }, action) => {
    switch (action.type) {
        case WISHLIST_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case WISHLIST_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: action.payload
            }
        case WISHLIST_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}


export const updateWishlistReducer = (state = { loading: false, wishlist: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.UPDATE_WISHLIST_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.UPDATE_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: action.payload
            }
        case actionType.UPDATE_WISHLIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const deleteWishlistReducer = (state = { loading: false, wishlist: {}, error: "" }, action) => {
    switch (action.type) {
        case actionType.DELETE_WISHLIST_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionType.DELETE_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: action.payload
            }
        case actionType.DELETE_WISHLIST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}