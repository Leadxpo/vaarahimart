import {
    FETCH_COUPONS_SUCCESS,
    FETCH_COUPONS_REQUEST,
    FETCH_COUPONS_FAILURE,
    COUPON_DETAIL_REQUEST,
    COUPON_DETAIL_SUCCESS,
    COUPON_DETAIL_FAIL,
} from "../Constants/couponConstant";

import * as actionTyes from "../Constants/couponConstant";
import api from "../../Api/api";

export const fetchCoupons = () => async (dispatch) => {
    dispatch({ type: FETCH_COUPONS_REQUEST });

    try {
        // Attempt to fetch coupons
        const { data } = await api.get(`/coupons/get-all-coupon`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_COUPONS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            dispatch({ type: FETCH_COUPONS_FAILURE, payload: error.message });
    }
};

export const couponById = (coupon_id) => async (dispatch) => {
    dispatch({ type: COUPON_DETAIL_REQUEST })
    try {
        // Attempt to fetch coupons
        const { data } = await api.post(`/coupons/get-coupon-by-id`, { id: coupon_id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: COUPON_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: COUPON_DETAIL_FAIL, payload: error.message });
    }
}
