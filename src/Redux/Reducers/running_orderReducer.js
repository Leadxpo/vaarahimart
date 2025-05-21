import { CREATE_RUNNING_ORDERS_REQUEST, CREATE_RUNNING_ORDERS_SUCCESS, CREATE_RUNNING_ORDERS_FAILURE, DELETE_RUNNING_ORDER_REQUEST, UPDATE_RUNNING_ORDER_REQUEST } from "../Constants/running_orderConstant";
import * as actionType from "../Constants/running_orderConstant";

const initialState = {
  orderData: null,
  loading: false,
  error: null,
};

export const runningOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_RUNNING_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_RUNNING_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orderData: action.payload,
      };
    case CREATE_RUNNING_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_RUNNING_ORDER_REQUEST:
      return {
        ...state,
        orderData: {
          ...state.orderData,  // Spread the existing orderData
          ...action.payload,   // Merge with the updated data
        },
      };
    case DELETE_RUNNING_ORDER_REQUEST:
      return {
        ...state,
        orderData: null, // Clear the order data
      };

    default:
      return state;
  }
};
