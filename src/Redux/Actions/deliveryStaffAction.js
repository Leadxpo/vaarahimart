import {
    GET_DELIVERYSTAFFS_SUCCESS,
    GET_DELIVERYSTAFFS_REQUEST,
    GET_DELIVERYSTAFFS_FAILURE,
    DELIVERYSTAFF_DETAIL_REQUEST,
    DELIVERYSTAFF_DETAIL_SUCCESS,
    DELIVERYSTAFF_DETAIL_FAIL,
    DELIVERYSTAFF_DETAIL_DELETE,
    UPDATE_DELIVERYSTAFF_REQUEST,
    UPDATE_DELIVERYSTAFF_SUCCESS,
    UPDATE_DELIVERYSTAFF_FAIL,
    UPDATE_DELIVERYSTAFFDP_REQUEST,
    UPDATE_DELIVERYSTAFFDP_SUCCESS,
    UPDATE_DELIVERYSTAFFDP_FAIL,
} from "../Constants/deliveryStaffConstant";
import * as actionTypes from "../Constants/deliveryStaffConstant";
import api from "../../Api/api";


const getDeliveryStaffs = () => async (dispatch) => {
    dispatch({ type: GET_DELIVERYSTAFFS_REQUEST });

    try {
        // Attempt to fetch deliveryStaffs
        const { data } = await api.get(`/deliveryStaff/get-all-deliveryStaff`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });

        dispatch({ type: GET_DELIVERYSTAFFS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: GET_DELIVERYSTAFFS_FAILURE, payload: error.message });
    }
};

const getDeliveryStaffById = (staffID) => async (dispatch) => {
    dispatch({ type: DELIVERYSTAFF_DETAIL_REQUEST })
    try {
        const { data } = await api.post(`/deliveryStaff/get-Staff-by-id`, { staffID:staffID }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: DELIVERYSTAFF_DETAIL_SUCCESS, payload: data.data })
    } catch (error) {
            // Handle other types of errors
            dispatch({ type: DELIVERYSTAFF_DETAIL_FAIL, payload: error.message });
    }
}

const updateDeliveryStaff = (deliveryStaffdata) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_DELIVERYSTAFF_REQUEST })
        const { data } = await api.post(`/deliveryStaff/update-DeliveryStaff`,deliveryStaffdata , {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: UPDATE_DELIVERYSTAFF_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: UPDATE_DELIVERYSTAFF_FAIL, payload: error.message });
    }
}
const updateDeliveryStaffDP = (deliveryStaffdata) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_DELIVERYSTAFFDP_REQUEST })
        const { data } = await api.post(`/deliveryStaff/update-DeliveryStaffDP`,deliveryStaffdata , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: UPDATE_DELIVERYSTAFFDP_SUCCESS, payload: data.data })
    } catch (error) {
        console.error('DeliveryStaff DP Update Error:', error.response?.data || error.message);
        dispatch({ type: UPDATE_DELIVERYSTAFFDP_FAIL, payload: error.response?.data?.message || error.message });
    }
} 

const deleteDeliveryStaffDetails = () => (dispatch) => {
    dispatch({ type:  DELIVERYSTAFF_DETAIL_DELETE, });
  };

export { getDeliveryStaffById, getDeliveryStaffs, updateDeliveryStaff,updateDeliveryStaffDP,deleteDeliveryStaffDetails}