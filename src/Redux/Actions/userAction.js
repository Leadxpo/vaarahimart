import {
    GET_USERS_SUCCESS,
    GET_USERS_REQUEST,
    GET_USERS_FAILURE,
    USER_DETAIL_REQUEST,
    USER_DETAIL_SUCCESS,
    USER_DETAIL_FAIL,
    USER_DETAIL_DELETE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USERDP_REQUEST,
    UPDATE_USERDP_SUCCESS,
    UPDATE_USERDP_FAIL,
} from "../Constants/userConstant";
import * as actionTypes from "../Constants/userConstant";
import api from "../../Api/api";


const getUsers = () => async (dispatch) => {
    dispatch({ type: GET_USERS_REQUEST });

    try {
        // Attempt to fetch users
        const { data } = await api.get(`/user/get-all-user`, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: GET_USERS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ",error)
        // If the error status is 500, try refreshing the token
            // Handle other types of errors
            dispatch({ type: GET_USERS_FAILURE, payload: error.message });
    }
};

const getUserById = (userID) => async (dispatch) => {
    dispatch({ type: USER_DETAIL_REQUEST })
    try {
        const { data } = await api.post(`/user/get-User-by-id`, { userID }, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: USER_DETAIL_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: USER_DETAIL_FAIL, payload: error.message });
    }
}

const updateUser = (userdata) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST })
        const { data } = await api.post(`/user/update-User`,userdata , {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: UPDATE_USER_SUCCESS, payload: data.data })
    } catch (error) {
        console.log("error : ",error)
            // Handle other types of errors
            dispatch({ type: UPDATE_USER_FAIL, payload: error.message });
    }
}
const updateUserDP = (userdata) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USERDP_REQUEST })
        const { data } = await api.post(`/user/update-UserDP`,userdata , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: UPDATE_USERDP_SUCCESS, payload: data.data })
    } catch (error) {
        console.error('User DP Update Error:', error.response?.data || error.message);
        dispatch({ type: UPDATE_USERDP_FAIL, payload: error.response?.data?.message || error.message });
    }
} 

export const deleteUerDetails = () => (dispatch) => {
    dispatch({ type:  USER_DETAIL_DELETE, });
  };

export { getUserById, getUsers, updateUser,updateUserDP}