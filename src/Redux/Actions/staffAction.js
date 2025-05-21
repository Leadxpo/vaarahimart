import {
    STAFF_DETAIL_REQUEST,
    STAFF_DETAIL_SUCCESS,
    STAFF_DETAIL_FAIL,
    UPDATE_STAFF_REQUEST,
    UPDATE_STAFF_SUCCESS,
    UPDATE_STAFF_FAIL,
} from "../Constants/staffConstant";

import * as actionTyes from "../Constants/staffConstant";
import api from "../../Api/api";


export const getStaffById = (id) => async (dispatch) => {
    dispatch({ type: STAFF_DETAIL_REQUEST })
    try {
        // Attempt to fetch STAFFS
        const { data } = await api.post(`/deliveryStaff/get-staff-by-id`, { id }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: STAFF_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: STAFF_DETAIL_FAIL, payload: error.message });
    }
}

export const updateStaff = (staff) => async (dispatch) => {
    dispatch({ type: UPDATE_STAFF_REQUEST })
    try {
        // Attempt to fetch STAFFS
        const { data } = await api.post(`/deliveryStaff/update-staff`, staff, {
            headers: {
                
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: UPDATE_STAFF_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: UPDATE_STAFF_FAIL, payload: error.message });
    }
}
