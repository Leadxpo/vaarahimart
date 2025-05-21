// actionUser.js
import api from '../../Api/api';  // Assuming api.js is in the same directory
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  DELIVERYSTAFF_LOGIN_REQUEST,
  DELIVERYSTAFF_LOGIN_SUCCESS,
  DELIVERYSTAFF_LOGIN_FAILURE,
} from '../Constants/loginConstant';

// Login action
export const login = (phone_no,name) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } }
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const  {data}  = await api.post('/user/login-user', { phone_no, name},config);   
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data.data
    });
    return data.data
  } catch (error) {
        console.log("error : ",error)
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: error.response && error.response.data.message
        ? error.response.data.success
        : error.message
    });
  }
};
export const deliveryStafflogin = (staffLoginData) => async (dispatch) => {

  const config = { headers: { "Content-Type": "application/json" } }
  try {
    dispatch({ type: DELIVERYSTAFF_LOGIN_REQUEST });
    const  {data}  = await api.post('/deliveryStaff/login-Staff',staffLoginData,config);   
    console.log("data : ",data.data)
    dispatch({
      type: DELIVERYSTAFF_LOGIN_SUCCESS,
      payload: data.data
    });
  } catch (error) {
        console.log("error : ",error.response.data.success)
    dispatch({
      type: DELIVERYSTAFF_LOGIN_FAILURE,
      payload: error.response.data.success
    });
  }
};