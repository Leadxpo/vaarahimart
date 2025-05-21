// reducerUser.js
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    DELIVERYSTAFF_LOGIN_REQUEST,
    DELIVERYSTAFF_LOGIN_SUCCESS,
    DELIVERYSTAFF_LOGIN_FAILURE,
  } from '../Constants/loginConstant';
  
  const userInitialState = {
    loading: false,
    userInfo: null,
    error: null,
  };
  const deliveryStaffInitialState = {
    loading: false,
    deliveryStaffInfo: null,
    error: null,
  };
  
  export const userLoginReducer = (state = userInitialState, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return { ...state, loading: true };
      case USER_LOGIN_SUCCESS:
        return { loading: false, userInfo: action.payload, error: null };
      case USER_LOGIN_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  export const deliveryStaffLoginReducer = (state = deliveryStaffInitialState, action) => {
    switch (action.type) {
      case DELIVERYSTAFF_LOGIN_REQUEST:
        return { ...state, loading: true };
      case DELIVERYSTAFF_LOGIN_SUCCESS:
        return { loading: false, deliveryStaffInfo: action.payload, error: true };
      case DELIVERYSTAFF_LOGIN_FAILURE:
        console.log("reducers fail : ",action.payload)
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  