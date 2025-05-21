import {
  CREATE_ADDRESSES_SUCCESS,
  CREATE_ADDRESSES_REQUEST,
  CREATE_ADDRESSES_FAILURE,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_FAILURE,
  FETCH_ADDRESSES_DELETE,
  ADDRESS_DETAIL_REQUEST,
  ADDRESS_DETAIL_SUCCESS,
  ADDRESS_DETAIL_FAIL,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL
} from "../Constants/addressConstant";
import * as actionType from "../Constants/addressConstant";
import api from "../../Api/api";


export const createAddress = (userID,addressData) => async (dispatch) => {
  const {name,user_id,phone_no,user_name,address_line_one,address_line_two,city,state,pincode}=addressData
  dispatch({ type: CREATE_ADDRESSES_REQUEST });
  try {
    const { data } = await api.post(`/address/create-address`,{userID,name,phone_no,user_id,user_name,address_line_one,address_line_two,city,state,pincode}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: CREATE_ADDRESSES_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: CREATE_ADDRESSES_FAILURE, payload: error.message });
  }
};

export const fetchAddresses = (addressUserID) => async (dispatch) => {
  dispatch({ type: FETCH_ADDRESSES_REQUEST });

  try {
    const { data } = await api.post(`/address/get-address-by-userId`,{userID:addressUserID}, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: FETCH_ADDRESSES_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: FETCH_ADDRESSES_FAILURE, payload: error.message });
  }
};

export const deleteUserAddress = () => (dispatch) => {
  dispatch({ type:  FETCH_ADDRESSES_DELETE, });
};


export const getAddressDetail = (id,userID) => async (dispatch) => {
  dispatch({ type: ADDRESS_DETAIL_REQUEST });
  try {
    const { data } = await api.post(`/address/get-Address-by-id`, { id }, {
      headers: {

        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: ADDRESS_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: ADDRESS_DETAIL_FAIL, payload: error.message });
  }
};

export const updateAddressByID = (userID,addressData) => async (dispatch) => {
  const {id,name,user_id,phone_no,user_name,address_line_one,address_line_two,city,state,pincode}=addressData

  dispatch({ type: UPDATE_ADDRESS_REQUEST });
  try {
    const { data } = await api.post(`/address/update-address`, {userID,id,name,phone_no,user_id,user_name,address_line_one,address_line_two,city,state,pincode}, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: UPDATE_ADDRESS_FAIL, payload: error.message });
  }
};

export const deleteAddress = (userID,id) => async (dispatch) => {
  dispatch({ type: DELETE_ADDRESS_REQUEST });
  try {
    const { data } = await api.post(`/address/delete-address`, { userID, id }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: data.data });
  } catch (error) {
        console.log("error : ",error)
    dispatch({ type: DELETE_ADDRESS_FAIL, payload: error.message });
  }
};
