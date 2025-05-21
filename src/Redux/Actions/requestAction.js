import {
    FETCH_REQUESTS_SUCCESS,
    FETCH_REQUESTS_REQUEST,
    FETCH_REQUESTS_FAILURE,
    FETCH_PENDING_REQUESTS_SUCCESS,
    FETCH_PENDING_REQUESTS_REQUEST,
    FETCH_PENDING_REQUESTS_FAILURE,
    FETCH_PENDING_REQUESTS_DELETE,
    REQUEST_DETAIL_REQUEST,
    REQUEST_DETAIL_SUCCESS,
    REQUEST_DETAIL_FAIL,
    CREATE_REQUEST_REQUEST,
    CREATE_REQUEST_SUCCESS,
    CREATE_REQUEST_FAIL,
    UPDATE_REQUEST_REQUEST,
    UPDATE_REQUEST_SUCCESS,
    UPDATE_REQUEST_FAIL,
    DELETE_REQUEST_REQUEST,
    DELETE_REQUEST_SUCCESS,
    DELETE_REQUEST_FAIL
} from "../Constants/requestConstant";

import * as actionTyes from "../Constants/requestConstant";
import api from "../../Api/api";

export const createRequest = (requestData) => async (dispatch) => {

    try {
        dispatch({ type: CREATE_REQUEST_REQUEST, })
        const { data } = await api.post(`/user/create-request`, requestData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: CREATE_REQUEST_SUCCESS, payload: data.data })
    } catch (error) {
        console.error('User DP Update Error:', error.response?.data || error.message);
        dispatch({ type: CREATE_REQUEST_FAIL, payload: error.response?.data?.message || error.message });
    }
}


export const fetchRequests = () => async (dispatch) => {
    dispatch({ type: FETCH_REQUESTS_REQUEST });

    try {
        // Attempt to fetch requests
        const { data } = await api.get(`/request/get-all-request`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_REQUESTS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_REQUESTS_FAILURE, payload: error.message });
    }
};

export const fetchPendingRequestsbyStaffID = (staffID) => async (dispatch) => {
    dispatch({ type: FETCH_PENDING_REQUESTS_REQUEST });

    try {
        // Attempt to fetch requests
        const { data } = await api.post(`/request/get-pending-request-by-staffID`,{ staffID: staffID }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        dispatch({ type: FETCH_PENDING_REQUESTS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("pending error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_PENDING_REQUESTS_FAILURE, payload: error.message });
    }
};

export const getRequestByStaffID = (request_id) => async (dispatch) => {
    dispatch({ type: REQUEST_DETAIL_REQUEST })
    try {
        // Attempt to fetch requests
        const { data } = await api.post(`/request/get-requests-by-staffID`, { request_id }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: REQUEST_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: REQUEST_DETAIL_FAIL, payload: error.message });
    }
}


export const updateRequestReplay = (adminReplay, requestID) => async (dispatch) => {
    dispatch({ type: UPDATE_REQUEST_REQUEST })
    try {
        // Attempt to fetch requests
        const { data } = await api.post(`/request/update-request`, { id: requestID, replay: adminReplay }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: UPDATE_REQUEST_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: UPDATE_REQUEST_FAIL, payload: error.message });
    }
}

export const deleteRequest = (id) => async (dispatch) => {
    dispatch({ type: DELETE_REQUEST_REQUEST })
    try {
        // Attempt to fetch requests
        const { data } = await api.post(`/request/update-request`, { request_id: id, status: 'inactive' }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: DELETE_REQUEST_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        // Handle other types of errors
        dispatch({ type: DELETE_REQUEST_FAIL, payload: error.message });
    }

}

export const deletePendingRequestsbyStaffID = () => (dispatch) => {
    dispatch({ type:  FETCH_PENDING_REQUESTS_DELETE });
  };
