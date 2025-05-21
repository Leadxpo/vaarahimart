import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM, SET_TO_CART, CLEAR_CART } from '../Constants/cartItemsConstant';

export const setToCart = (product) => {
    return {
        type: SET_TO_CART,
        payload: product, 
    };
};

export const addToCart = (product) => {
    return {
        type: ADD_TO_CART,
        payload: product, 
    };
};
 
export const removeFromCart = (productId) => {
    return {
        type: REMOVE_FROM_CART,
        payload: productId, 
    }; 
};

export const updateCartItem = (productId, quantity) => {
    return {
        type: UPDATE_CART_ITEM,
        payload: { productId, quantity },
    };
};
export const clearCart = (productId, quantity) => {
    return {
        type: CLEAR_CART
    };
};
