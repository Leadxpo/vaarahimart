import {
  CREATE_WISHLISTS_SUCCESS,
  CREATE_WISHLISTS_REQUEST,
  CREATE_WISHLISTS_FAILURE,
  FETCH_WISHLISTS_SUCCESS,
  FETCH_WISHLISTS_REQUEST,
  FETCH_WISHLISTS_FAILURE,
  FETCH_WISHLISTS_DELETE,
  WISHLIST_DETAIL_REQUEST,
  WISHLIST_DETAIL_SUCCESS,
  WISHLIST_DETAIL_FAIL,
  UPDATE_WISHLIST_REQUEST,
  UPDATE_WISHLIST_SUCCESS,
  UPDATE_WISHLIST_FAIL,
  DELETE_WISHLIST_REQUEST,
  DELETE_WISHLIST_SUCCESS,
  DELETE_WISHLIST_FAIL
} from "../Constants/wishlistConstant";
import * as actionType from "../Constants/wishlistConstant";
import api from "../../Api/api";


export const createWishlists = (userID, wishlistID) => async (dispatch) => {
  dispatch({ type: CREATE_WISHLISTS_REQUEST });

  try {
    // Making API request to create a wishlist
    const { data } = await api.post(`/wishlist/create-wishlist`,
      { userID, wishlistID },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Dispatching success action
    dispatch({ type: CREATE_WISHLISTS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error);
    // Dispatching failure action
    dispatch({ type: CREATE_WISHLISTS_FAILURE, payload: error.message });
  }
};

export const fetchWishlists = (userID) => async (dispatch) => {
  dispatch({ type: FETCH_WISHLISTS_REQUEST });
  try {
    const { data } = await api.post(`/product/get-product-by-wishlist`, { userID }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_WISHLISTS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: FETCH_WISHLISTS_FAILURE, payload: error.message });
  }
};

export const deleteUserWishList = () => (dispatch) => {
  dispatch({ type:  FETCH_WISHLISTS_DELETE, });
};


export const getWishlistDetail = (id, userID) => async (dispatch) => {
  dispatch({ type: WISHLIST_DETAIL_REQUEST });
  try {
    const { data } = await api.post(`/wishlist/get-Wishlist-by-id`, { id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: WISHLIST_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: WISHLIST_DETAIL_FAIL, payload: error.message });
  }
};

export const updateWishlist = (wishlist, id, userID) => async (dispatch) => {
  dispatch({ type: UPDATE_WISHLIST_REQUEST });
  try {
    const { data } = await api.post(`/wishlist/update-Wishlist`, { id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: UPDATE_WISHLIST_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: UPDATE_WISHLIST_FAIL, payload: error.message });
  }
};

export const deleteWishlist = (userID, wishlistID) => async (dispatch) => {
  dispatch({ type: DELETE_WISHLIST_REQUEST });
  try {
    const { data } = await api.post(`/wishlist/delete-wishlist`, { userID, wishlistID }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: DELETE_WISHLIST_SUCCESS, payload: data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: DELETE_WISHLIST_FAIL, payload: error.message });
  }
};
