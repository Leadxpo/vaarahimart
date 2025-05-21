import {
    FETCH_BRANDS_SUCCESS,
    FETCH_BRANDS_REQUEST,
    FETCH_BRANDS_FAILURE,
    FETCH_LIMITED_BRANDS_SUCCESS,
    FETCH_LIMITED_BRANDS_REQUEST,
    FETCH_LIMITED_BRANDS_FAILURE,
    BRAND_PRODUCT_REQUEST,
    BRAND_PRODUCT_FAIL,
    BRAND_PRODUCT_SUCCESS,
    BRAND_DETAIL_REQUEST,
    BRAND_DETAIL_SUCCESS,
    BRAND_DETAIL_FAIL,
} from "../Constants/brandConstant";

import * as actionTyes from "../Constants/brandConstant";
import api from "../../Api/api";

export const fetchBrands = () => async (dispatch) => {
    dispatch({ type: FETCH_BRANDS_REQUEST });

    try {
        // Attempt to fetch brands
        const { data } = await api.get(`/brand/get-all-brands`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_BRANDS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_BRANDS_FAILURE, payload: error.message });
    }
};
export const fetchLimitedBrands = () => async (dispatch) => {
    dispatch({ type: FETCH_LIMITED_BRANDS_REQUEST });

    try {
        // Attempt to fetch brands
        const { data } = await api.get(`/brand/get-limited-brands`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_LIMITED_BRANDS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_LIMITED_BRANDS_FAILURE, payload: error.message });
    }
};

export const productsByBrandId = (brand_id) => async (dispatch) => {
    dispatch({ type: BRAND_PRODUCT_REQUEST })
    try {
        // Attempt to fetch brands
        const { data } = await api.post(`/brand/get-brands-by-id`, { brand_id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: BRAND_PRODUCT_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: BRAND_PRODUCT_FAIL, payload: error.message });
    }
}

export const brandById = (brand_id) => async (dispatch) => {
    dispatch({ type: BRAND_DETAIL_REQUEST })
    try {
        // Attempt to fetch brands
        const { data } = await api.post(`/brand/get-brands-by-id`, { brand_id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: BRAND_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: BRAND_DETAIL_FAIL, payload: error.message });
    }
}
