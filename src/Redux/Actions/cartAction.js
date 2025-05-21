import {
  CREATE_CARTS_SUCCESS,
  CREATE_CARTS_REQUEST,
  CREATE_CARTS_FAILURE,
  CREATE_REORDERED_CARTS_SUCCESS,
  CREATE_REORDERED_CARTS_REQUEST,
  CREATE_REORDERED_CARTS_FAILURE,
  FETCH_CARTS_SUCCESS,
  FETCH_CARTS_REQUEST,
  FETCH_CARTS_FAILURE,
  FETCH_CART_PRODUCTS_SUCCESS,
  FETCH_CART_PRODUCTS_REQUEST,
  FETCH_CART_PRODUCTS_FAILURE,
  FETCH_CARTS_DELETE,
  CART_DETAIL_REQUEST,
  CART_DETAIL_SUCCESS,
  CART_DETAIL_FAIL,
  UPDATE_CART_REQUEST,
  UPDATE_CART_SUCCESS,
  UPDATE_CART_FAIL,
  DELETE_CART_REQUEST,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAIL,
  DELETE_CART_BY_VARIENT_REQUEST,
  DELETE_CART_BY_VARIENT_SUCCESS,
  DELETE_CART_BY_VARIENT_FAIL
} from "../Constants/cartConstant";
import * as actionType from "../Constants/cartConstant";
import api from "../../Api/api";


export const createCarts = (userID,productData) => async (dispatch) => {
  const {brand, brand_id, category, category_id,  id, image, name, price, product_discount, product_id,  units, weight}=productData
  dispatch({ type: CREATE_CARTS_REQUEST });
  try {
    const { data } = await api.post(`/cart/create-cart`,{userID,user_id:userID,product_id:id,variant_id:product_id,product_name:name,image,brand, brand_id, category, category_id,price,qty:1, product_discount, units, weight}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: CREATE_CARTS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: CREATE_CARTS_FAILURE, payload: error.message });
  }
};

export const createReOrderedCarts = (productData) => async (dispatch) => {
  const {user_id,qty,brand, brand_id, category, category_id,image, product_name, price, product_discount, product_id,variant_id, units, weight}=productData
  dispatch({ type: CREATE_REORDERED_CARTS_REQUEST });
  try {
    const { data } = await api.post(`/cart/create-cart`,{userID:user_id,user_id,product_id,variant_id,product_name,image,brand, brand_id, category, category_id,price,qty, product_discount, units, weight}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: CREATE_REORDERED_CARTS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: CREATE_REORDERED_CARTS_FAILURE, payload: error.message });
  }
};

export const fetchCarts = (cartuserID) => async (dispatch) => {
  dispatch({ type: FETCH_CARTS_REQUEST });
  try {
    const { data } = await api.post(`/cart/get-cart-by-userID`,{userID:cartuserID}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_CARTS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: FETCH_CARTS_FAILURE, payload: error.message });
  }
};

export const fetchCartProducts = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_CART_PRODUCTS_REQUEST });

  try {
    const { data } = await api.post(`/product/get-product-by-cartVarient`,{userId}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_CART_PRODUCTS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: FETCH_CART_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const deleteUserCarts = () => (dispatch) => {
  dispatch({ type:  FETCH_CARTS_DELETE, });
};


export const getCartDetail = (id,userID) => async (dispatch) => {
  dispatch({ type: CART_DETAIL_REQUEST });
  try {
    const { data } = await api.post(`/cart/get-Cart-by-id`, { id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: CART_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: CART_DETAIL_FAIL, payload: error.message });
  }
};

export const updateCartByProductID = (userID,productData,qty) => async (dispatch) => {
  const {brand, brand_id, category, category_id,  id, image, name, price, product_discount, product_id,  units, weight}=productData

  dispatch({ type: UPDATE_CART_REQUEST });
  try {
    const { data } = await api.post(`/cart/update-cart-by-productID`, {userID,user_id:userID,product_id:id,variant_id:product_id,product_name:name,image,brand, brand_id, category, category_id,price,qty:qty, product_discount, units, weight}, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    dispatch({ type: UPDATE_CART_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: UPDATE_CART_FAIL, payload: error.message });
  }
};

export const updateCart = (cart, id,userID) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_REQUEST });
  try {
    const { data } = await api.post(`/cart/update-Cart`, { id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: UPDATE_CART_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: UPDATE_CART_FAIL, payload: error.message });
  }
};

export const deleteCart = (userID) => async (dispatch) => {
  dispatch({ type: DELETE_CART_REQUEST });
  try {
    const { data } = await api.post(`/cart/delete-cart`, { userID }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: DELETE_CART_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: DELETE_CART_FAIL, payload: error.message });
  }
};
export const removeCartByVarients = (userID,varient_id) => async (dispatch) => {
  dispatch({ type: DELETE_CART_BY_VARIENT_REQUEST });
  try {
    const { data } = await api.post(`/cart/delete-cart-by-varient`, { userID,varient_id}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: DELETE_CART_BY_VARIENT_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error.message)
    dispatch({ type: DELETE_CART_BY_VARIENT_FAIL, payload: error.message });
  }
};
