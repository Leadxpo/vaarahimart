// reducerUser.js
import {
    USER_PINCODE_REQUEST,
    USER_PINCODE_SUCCESS,
    USER_PINCODE_FAILURE,
  } from '../Constants/pincodeCheckConstant';
  
  const userLocationState = {
    loading: false,
    isPincodeExist: null,
    error: null,
  };

  export const userPincodeReducer = (state = userLocationState, action) => {
    switch (action.type) {
      case USER_PINCODE_REQUEST:
        return { ...state, loading: true };
      case USER_PINCODE_SUCCESS:
        return { loading: false, isPincodeExist: action.payload, error: null };
      case USER_PINCODE_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  