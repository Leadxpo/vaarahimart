import {
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_FAILURE,
    FETCH_PRODUCTS_PAGINATION_SUCCESS,
    FETCH_PRODUCTS_PAGINATION_REQUEST,
    FETCH_PRODUCTS_PAGINATION_FAILURE,
    PRODUCT_DETAIL_REQUEST, 
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,
} from "../Constants/productConstant";

import * as actionTyes from "../Constants/productConstant";
import api from "../../Api/api";

export const fetchProducts = () => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
        // Attempt to fetch PRODUCTS
        const { data } = await api.get(`/product/get-all-product`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
        }
};

// action
export const fetchProductsByCategoryWithPagination = (category, page , limit) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_PAGINATION_REQUEST, payload: { category, page } });
    try {
        // Fetch products by category, page, and limit
        const { data } = await api.post(`/product/get-products-by-category-with-pagination`, {
            category,
            page,
            limit
        });
        // Dispatch success action with paginated data
        dispatch({
            type: FETCH_PRODUCTS_PAGINATION_SUCCESS,
            payload: {
                products: data.data.products,      // The paginated products
                category,                     // The category
                page,                         // The current page
                hasMore: data.data.hasMore,        // Flag to indicate if there are more products to load
                totalProducts: data.data.totalProducts,  // Total number of products in the category
            },
        });
    } catch (error) {
        console.log("Error fetching products by category: ", error);
        dispatch({
            type: FETCH_PRODUCTS_PAGINATION_FAILURE,
            payload: error.message,
        });
    }
};

export const productById = (id,userID) => async (dispatch) => {
    dispatch({ type: PRODUCT_DETAIL_REQUEST })
    try {
        // Attempt to fetch PRODUCTS
        const { data } = await api.post(`/product/get-product-by-id`, { id}, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: PRODUCT_DETAIL_FAIL, payload: error.message });
        }
}

