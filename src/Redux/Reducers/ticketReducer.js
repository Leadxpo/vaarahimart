import * as actionTypes from "../Constants/ticketConstant";

const initialState = {
    loading: false,
    tickets: [],
    error: ""
}

export const ticketReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_TICKETS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_TICKETS_SUCCESS:
            if (state.tickets === action.payload) {
                return state;  // No state change if the array is the same
              }
            return {
                ...state,
                loading: false,
                tickets: action.payload
            }
        case actionTypes.FETCH_TICKETS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}

export const ticketDetailReducer = (state = { loading: false, ticket: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.TICKET_DETAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.TICKET_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                ticket: action.payload
            }
        case actionTypes.TICKET_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

export const updateTicketReducer = (state = { loading: false, ticket: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_TICKET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.UPDATE_TICKET_SUCCESS:
            return {
                ...state,
                loading: false,
                ticket: action.payload
            }
        case actionTypes.UPDATE_TICKET_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state

    }
}

export const createTicketReducer = (state = { loading: false, ticket: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.CREATE_TICKET_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.CREATE_TICKET_SUCCESS:
            return {
                ...state,
                loading: false,
                ticket: action.payload
            }
        case actionTypes.CREATE_TICKET_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const deleteTicketReducer = (state = { loading: false, ticket: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.DELETE_TICKET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.DELETE_TICKET_SUCCESS:
            return {
                ...state,
                loading: false,
                ticket: action.payload
            }
        case actionTypes.DELETE_TICKET_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }
}
