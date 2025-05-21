// actionUser.js
import api from '../../Api/api';  // Assuming api.js is in the same directory
import {
  USER_PINCODE_REQUEST,
  USER_PINCODE_SUCCESS,
  USER_PINCODE_FAILURE,
} from '../Constants/pincodeCheckConstant';

// Pincode action
export const pincodeCheck = (pincode) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } }
  try {
    dispatch({ type: USER_PINCODE_REQUEST });
    const  {data}  = await api.post('/userLocation/check-pincode', {pincode},config);   
    if(data.data){
      dispatch({
        type: USER_PINCODE_SUCCESS,
        payload: true
      });
    }else{
      dispatch({
        type: USER_PINCODE_SUCCESS,
        payload:false
      });
    }
    return data.data
  } catch (error) {
        console.log("error : ",error)
    dispatch({
      type: USER_PINCODE_FAILURE,
      payload: error.response && error.response.data.message
        ? error.response.data.success
        : error.message
    });
  }
};
