import * as actionTypes from "../Constants/notificationConstant";
import api from "../../Api/api";
import { FETCH_ASSIGNED_ORDERS_DELETE } from "../Constants/orderConstant";

export const fetchNotifications = (userID) => async (dispatch) => {

    dispatch({ type: actionTypes.GET_NOTIFICATIONS_REQUEST })
    try {
        const { data } = await api.post(`/notification/get-Notification-by-userID`,{userID}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const rrr=data.data;
        const notificationUserData=rrr.filter((item)=>{
            if (item.subtype=="all") {
                return(!item.viewers.include(userID))
            } else {
                return(!item.isview)
            }
        })
        dispatch({ type: actionTypes.GET_NOTIFICATIONS_SUCCESS, payload: notificationUserData})
    } catch (error) {
        console.log("error : ", error)
        dispatch({ type: actionTypes.GET_NOTIFICATIONS_FAIL, payload: error.message })
    }
}
export const fetchStaffNotifications = (staff_id) => async (dispatch) => {

    dispatch({ type: actionTypes.GET_STAFF_NOTIFICATIONS_REQUEST })
    try {
        const { data } = await api.post(`/notification/get-Notification-by-staffID`,{staff_id}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const rrr=data.data;
        const notificationUserData=rrr.filter((item)=>{
            if (item.subtype=="all") {
                return(!item.viewers.include(staff_id))
            } else {
                return(!item.isview)
            }
        })
        dispatch({ type: actionTypes.GET_STAFF_NOTIFICATIONS_SUCCESS, payload: notificationUserData})
    } catch (error) {
        console.log("error : ", error)
        dispatch({ type: actionTypes.GET_STAFF_NOTIFICATIONS_FAIL, payload: error.message })
    }
}

export const notificationDetail = (id,userID) => async (dispatch) => {
    dispatch({ type: actionTypes.NOTIFICATION_DETAIL_REQUEST })
    try {
        const { data } = await api.post(`/notification/get-Notification-by-id`, { id }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.NOTIFICATION_DETAIL_SUCCESS, payload: data })
    } catch (error) {
        console.log("error : ", error)
        dispatch({ type: actionTypes.NOTIFICATION_DETAIL_FAIL, payload: error.name })
    }
}

export const updateNotification = (userID, notificationData) => async (dispatch) => {
    const { id, notification, replay, isview } = notification
    dispatch({ type: actionTypes.UPDATE_NOTIFICATION_REQUEST })
    try {
        const { data } = await api.put(`/notification/get-Notification-by-id`, { id, notification, replay, isview }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.UPDATE_NOTIFICATION_SUCCESS, payload: data })
    } catch (error) {
        console.log("error : ", error)
        dispatch({ type: actionTypes.UPDATE_NOTIFICATION_FAIL, payload: error.name })
    }
}

export const deleteNotification = (id,userID) => async (dispatch) => {

    dispatch({ type: actionTypes.DELETE_NOTIFICATION_REQUEST })
    try {
        const { data } = await api.delete(`/notification/delete-Notification-by-id`, { id }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: actionTypes.DELETE_NOTIFICATION_SUCCESS, payload: data })
    } catch (error) {
        console.log("error : ", error)
        dispatch({ type: actionTypes.DELETE_NOTIFICATION_FAIL, payload: error.name })
    }
}

export const deleteStaffNotifications = () => (dispatch) => {
    dispatch({ type: actionTypes.GET_STAFF_NOTIFICATIONS_DELETE });
  };
  