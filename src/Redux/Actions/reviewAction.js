import * as actionTypes from "../Constants/reviewConstant";
import api from "../../Api/api";

export const createReviews = (userID) => async (dispatch) => {

    dispatch({ type: actionTypes.CREATED_REVIEW_REQUEST })
    try {
        const { data } = await api.post(`/review/create-Review`,{userID,}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.CREATED_REVIEW_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: actionTypes.CREATED_REVIEW_FAIL, payload: error.message })
    }
}

export const getReviews = () => async (dispatch) => {

    dispatch({ type: actionTypes.GET_REVIEWS_REQUEST })
    try {
        const { data } = await api.get(`/review/get-all-review`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.GET_REVIEWS_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: actionTypes.GET_REVIEWS_FAIL, payload: error.message })
    }
}

export const reviewDetail = (id) => async (dispatch) => {

    dispatch({ type: actionTypes.REVIEW_DETAIL_REQUEST })
    try {
        const { data } = await api.post(`/review/get-Review-by-id`, { id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.REVIEW_DETAIL_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: actionTypes.REVIEW_DETAIL_FAIL, payload: error.name })
    }
}

export const updateReview = (review) => async (dispatch) => {
    const { id, review, replay, isview } = review
    dispatch({ type: actionTypes.UPDATE_REVIEW_REQUEST })
    try {
        const { data } = await api.put(`/review/get-Review-by-id`, { id, review, replay, isview }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.UPDATE_REVIEW_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: actionTypes.UPDATE_REVIEW_FAIL, payload: error.name })
    }
}

export const deleteReview = (id) => async (dispatch) => {

    dispatch({ type: actionTypes.DELETE_REVIEW_REQUEST })
    try {
        const { data } = await api.delete(`/review/delete-Review-by-id`, { id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.DELETE_REVIEW_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: actionTypes.DELETE_REVIEW_FAIL, payload: error.name })
    }
}