import {
    FETCH_RECENT_ORDERS_SUCCESS,
    FETCH_RECENT_ORDERS_REQUEST,
    FETCH_RECENT_ORDERS_FAILURE,
    FETCH_RECENT_ORDERS_DELETE,
    RECENT_ORDER_DETAIL_REQUEST,
    RECENT_ORDER_DETAIL_SUCCESS,
    RECENT_ORDER_DETAIL_FAIL,
} from "../Constants/recentOrderConstant";

import * as actionTyes from "../Constants/recentOrderConstant";
import api from "../../Api/api";

export const fetchRecent_Orders = (userID) => async (dispatch) => {
    dispatch({ type: FETCH_RECENT_ORDERS_REQUEST });
    try {
        // Attempt to fetch RECENT_ORDERS
        const { data } = await api.post(`/recentOrders/get-all-recentOrders-by-userID`, { userID }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        dispatch({ type: FETCH_RECENT_ORDERS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error: ", error);

        // Handle the error and dispatch failure action
        dispatch({ type: FETCH_RECENT_ORDERS_FAILURE, payload: error.message });
    }
};

export const recent_OrderById = (id) => async (dispatch) => {
    dispatch({ type: RECENT_ORDER_DETAIL_REQUEST })
    try {
        // Attempt to fetch RECENT_ORDERS
        const { data } = await api.post(`/recent_Order/get-recent_Order-by-id`, { id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: RECENT_ORDER_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: RECENT_ORDER_DETAIL_FAIL, payload: error.message });
        }
}

export const deleteRecentOrders = () => (dispatch) => {
    dispatch({ type:  FETCH_RECENT_ORDERS_DELETE, });
  };


