import { SET_TO_CART, ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM, CLEAR_CART } from '../Constants/cartItemsConstant';

const initialState = {
    cartItems: {},
};

export const cartItemsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TO_CART:
            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [action.payload.id]: {
                        ...action.payload,
                        quantity: action.payload.quantity,
                    },
                },
            };
        case ADD_TO_CART:
            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [action.payload.id]: {
                        ...action.payload,
                        quantity: (state.cartItems[action.payload.id]?.quantity || 0) + 1,
                    },
                },
            };

        case REMOVE_FROM_CART:
            const { [action.payload]: removedItem, ...remainingItems } = state.cartItems;
            return {
                ...state,
                cartItems: remainingItems,
            };

        case UPDATE_CART_ITEM:
            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [action.payload.productId]: {
                        ...state.cartItems[action.payload.productId],
                        quantity: action.payload.quantity,
                    },
                },
            };
        case CLEAR_CART:
            return {
                ...state,
                cartItems: {},
            };

        default:
            return state;
    }
};
