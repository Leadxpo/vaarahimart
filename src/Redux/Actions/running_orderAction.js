import {
  CREATE_RUNNING_ORDERS_SUCCESS,
  CREATE_RUNNING_ORDERS_REQUEST,
  CREATE_RUNNING_ORDERS_FAILURE,
  UPDATE_RUNNING_ORDER_REQUEST,
  DELETE_RUNNING_ORDER_REQUEST,
} from "../Constants/running_orderConstant";
import * as actionType from "../Constants/running_orderConstant";
import api from "../../Api/api";


export const createRunningOrders = (runningOrderData) => async (dispatch) => {
  dispatch({ type: CREATE_RUNNING_ORDERS_REQUEST });
  try {
    dispatch({ type: CREATE_RUNNING_ORDERS_SUCCESS, payload:runningOrderData });
  } catch (error) {
        console.log("error : ",error)
    // Handle other errors
    dispatch({ type: CREATE_RUNNING_ORDERS_FAILURE, payload: error.message });
  }
};

export const updateRunningOrder = (updatedOrderData) => (dispatch) => {
  dispatch({
    type: UPDATE_RUNNING_ORDER_REQUEST,
    payload: updatedOrderData, // The updated order data
  });
};

export const deleteRunningOrder = () => (dispatch) => {
  dispatch({ type:  DELETE_RUNNING_ORDER_REQUEST, });
};