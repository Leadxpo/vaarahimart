import {
    FETCH_TICKETS_SUCCESS,
    FETCH_TICKETS_REQUEST,
    FETCH_TICKETS_FAILURE,
    TICKET_DETAIL_REQUEST,
    TICKET_DETAIL_SUCCESS,
    TICKET_DETAIL_FAIL,
    CREATE_TICKET_REQUEST,
    CREATE_TICKET_SUCCESS,
    CREATE_TICKET_FAIL,
    UPDATE_TICKET_REQUEST,
    UPDATE_TICKET_SUCCESS,
    UPDATE_TICKET_FAIL,
    DELETE_TICKET_REQUEST,
    DELETE_TICKET_SUCCESS,
    DELETE_TICKET_FAIL
} from "../Constants/ticketConstant";

import * as actionTyes from "../Constants/ticketConstant";
import api from "../../Api/api";

export const createTicket = (ticketData) => async (dispatch) => {

    try {
        dispatch({ type: CREATE_TICKET_REQUEST, })
        const { data } = await api.post(`/ticket/create-ticket`, ticketData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        dispatch({ type: CREATE_TICKET_SUCCESS, payload: data.data })
    } catch (error) {
        console.error('User DP Update Error:', error.response?.data || error.message);
        dispatch({ type: CREATE_TICKET_FAIL, payload: error.response?.data?.message || error.message });
    }
}


export const fetchTickets = (userId) => async (dispatch) => {
    dispatch({ type: FETCH_TICKETS_REQUEST });

    try {
        // Attempt to fetch tickets
        const { data } = await api.get(`/ticket/get-all-ticket-by-userid`,{userID:userId} ,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: FETCH_TICKETS_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: FETCH_TICKETS_FAILURE, payload: error.message });
    }
};

export const getTicketByd = (ticket_id) => async (dispatch) => {
    dispatch({ type: TICKET_DETAIL_REQUEST })
    try {
        // Attempt to fetch tickets
        const { data } = await api.post(`/ticket/get-tickets-by-id`, { ticket_id }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: TICKET_DETAIL_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: TICKET_DETAIL_FAIL, payload: error.message });
    }
}


export const updateTicketReplay = (adminReplay, ticketID) => async (dispatch) => {
    dispatch({ type: UPDATE_TICKET_REQUEST })
    try {
        // Attempt to fetch tickets
        const { data } = await api.post(`/ticket/update-ticket`, { id: ticketID, replay: adminReplay }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: UPDATE_TICKET_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        dispatch({ type: UPDATE_TICKET_FAIL, payload: error.message });
    }
}

export const deleteTicket = (id) => async (dispatch) => {
    dispatch({ type: DELETE_TICKET_REQUEST })
    try {
        // Attempt to fetch tickets
        const { data } = await api.post(`/ticket/update-ticket`, { ticket_id: id, status: 'inactive' }, {
            headers: {

                'Content-Type': 'application/json',
            },
        });
        dispatch({ type: DELETE_TICKET_SUCCESS, payload: data.data });
    } catch (error) {
        console.log("error : ", error)
        // If the error status is 500, try refreshing the token
        // Handle other types of errors
        dispatch({ type: DELETE_TICKET_FAIL, payload: error.message });
    }

}