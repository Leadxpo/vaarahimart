import {
  CREATE_ORDERS_SUCCESS,
  CREATE_ORDERS_REQUEST,
  CREATE_ORDERS_FAILURE,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_FAILURE,
  FETCH_ASSIGNED_ORDERS_SUCCESS,
  FETCH_ASSIGNED_ORDERS_REQUEST,
  FETCH_ASSIGNED_ORDERS_FAILURE,
  FETCH_ASSIGNED_ORDERS_DELETE,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL
} from "../Constants/orderConstant";
import * as actionType from "../Constants/orderConstant";
import api from "../../Api/api";

const getCurrentDateTime = () => {
  const now = new Date();
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const day = padZero(now.getDate());
  const month = padZero(now.getMonth() + 1); // Months are 0-based
  const year = now.getFullYear();

  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  return `${day}-${month}-${year}_${hours}:${minutes}:${seconds}`;
};


export const createOrders = (userID, userName, userPhoneNo, orderData) => async (dispatch) => {
  // const date_time = getCurrentDateTime(); 
  const { billing_address, shipping_address, coupon_applied, date_time_slot, discount, totalItemPrice, total_amt, orderItems } = orderData
  dispatch({ type: CREATE_ORDERS_REQUEST });

  try {
    const { data } = await api.post(`/orders/create-Order`, { userID, user_id: userID, name: userName, phone_no: userPhoneNo, date_time_slot, billing_address, shipping_address, coupon_applied, discount, total_amt: totalItemPrice, paid_amt: total_amt, order_items: orderItems }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: CREATE_ORDERS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    // Handle other errors
    dispatch({ type: CREATE_ORDERS_FAILURE, payload: error.message });
  }
};


export const fetchOrders = (userID) => async (dispatch) => {
  dispatch({ type: FETCH_ORDERS_REQUEST });

  try {
    const { data } = await api.post(`/orders/get-Order-by-userID`, { userID: userID }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_ORDERS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    // Handle other errors
    dispatch({ type: FETCH_ORDERS_FAILURE, payload: error.message });
  }
};

export const fetchAssignedOrder = (staffID) => async (dispatch) => {
  dispatch({ type: FETCH_ASSIGNED_ORDERS_REQUEST });

  try {
    const { data } = await api.post(`/orders/get-assigned-order-by-staffID`, { staffID: staffID }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_ASSIGNED_ORDERS_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("order error : ", error)
    // Handle other errors
    dispatch({ type: FETCH_ASSIGNED_ORDERS_FAILURE, payload: error.message });
  }
};

export const getOrderDetail = (userID, id) => async (dispatch) => {
  dispatch({ type: ORDER_DETAIL_REQUEST });
  try {
    const { data } = await api.post(`/orders/get-Order-by-id`, { userID, id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: ORDER_DETAIL_FAIL, payload: error.message });
  }
};

export const updateOrder = (userID, orderdetails, Transaction_id, payment_mode,payment_status) => async (dispatch) => {
  const {id,user_id}=orderdetails
  dispatch({ type: UPDATE_ORDER_REQUEST });
  try {
    const { data } = await api.post(`/orders/update-Order`, {userID, id, Transaction_id, payment_mode,payment_status}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: UPDATE_ORDER_FAIL, payload: error.message });
  }
};

export const deleteOrder = (userID, id) => async (dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });
  try {
    const { data } = await api.post(`/orders/update-Order`, { userID, id, status: "cancel" }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.data });
  } catch (error) {
    console.log("error : ", error)
    dispatch({ type: DELETE_ORDER_FAIL, payload: error.message });
  }
};

export const deleteAssignedOrderByStaffID = () => (dispatch) => {
  dispatch({ type: FETCH_ASSIGNED_ORDERS_DELETE });
};

