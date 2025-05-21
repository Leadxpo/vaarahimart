import {
    FETCH_BANNERS_SUCCESS,
    FETCH_BANNERS_REQUEST,
    FETCH_BANNERS_FAILURE,
    BANNER_DETAIL_REQUEST,
    BANNER_DETAIL_SUCCESS,
    BANNER_DETAIL_FAIL,
} from "../Constants/bannerConstant";

import * as actionTyes from "../Constants/bannerConstant";
import api from "../../Api/api";

export const fetchBanners = () => async (dispatch) => {
    dispatch({ type: FETCH_BANNERS_REQUEST });

    try {
        // Attempt to fetch banners
        const { data } = await api.get(`/banner/get-allBanners`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_BANNERS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_BANNERS_FAILURE, payload: error.message });
    }
};


export const bannerById = (id) => async (dispatch) => {
    dispatch({ type: BANNER_DETAIL_REQUEST })
    try {
        // Attempt to fetch banners
        const { data } = await api.post(`/banner/get-banner-by-id`, { id: id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: BANNER_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            dispatch({ type: BANNER_DETAIL_FAIL, payload: error.message });
    }
}