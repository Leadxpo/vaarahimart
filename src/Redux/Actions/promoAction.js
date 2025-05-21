import {
    FETCH_PROMOS_SUCCESS,
    FETCH_PROMOS_REQUEST,
    FETCH_PROMOS_FAILURE,
    PROMO_DETAIL_REQUEST,
    PROMO_DETAIL_SUCCESS,
    PROMO_DETAIL_FAIL,
} from "../Constants/promoConstant";

import * as actionTyes from "../Constants/promoConstant";
import api from "../../Api/api";

export const fetchPromos = () => async (dispatch) => {
    dispatch({ type: FETCH_PROMOS_REQUEST });

    try {
        // Attempt to fetch promos
        const { data } = await api.get(`/promo/get-allPromos`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_PROMOS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_PROMOS_FAILURE, payload: error.message });
    }
};


export const promoById = (id) => async (dispatch) => {
    dispatch({ type: PROMO_DETAIL_REQUEST })
    try {
        // Attempt to fetch promos
        const { data } = await api.post(`/promo/get-promo-by-id`, { id: id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: PROMO_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            dispatch({ type: PROMO_DETAIL_FAIL, payload: error.message });
    }
}