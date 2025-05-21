import * as actionTypes from "../Constants/productConstant";

const initialValue = {
    loading: false,
    products: [],
    error: ""
}

const initialPaginationState = {
    loading: false,
    error: null,
    productsByCategory: {}, // Store products for each category
    pagesByCategory: {},    // Track the current page for each category
    hasMoreByCategory: {},  // Track if more products are available for each category
    totalProductsByCategory: {}, // Track total products count by category
};

export const productsPaginationReducer = (state = initialPaginationState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PRODUCTS_PAGINATION_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case actionTypes.FETCH_PRODUCTS_PAGINATION_SUCCESS:
            const { category, page, products, hasMore, totalProducts } = action.payload;

            // Merge the new products with existing products for the category
            const existingProducts = state.productsByCategory[category] || [];
            const newProducts = page === 1 ? products : [...existingProducts, ...products];

            // Remove duplicate products by id
            const uniqueProducts = newProducts.filter(
                (product, index, self) =>
                    index === self.findIndex((p) => p.id === product.id)
            );


            return {
                ...state,
                loading: false,
                productsByCategory: {
                    ...state.productsByCategory,
                    [category]: uniqueProducts, // Store products for the category
                },
                pagesByCategory: {
                    ...state.pagesByCategory,
                    [category]: page, // Update the page for the category
                },
                hasMoreByCategory: {
                    ...state.hasMoreByCategory,
                    [category]: hasMore, // Update hasMore flag for the category
                },
                totalProductsByCategory: {
                    ...state.totalProductsByCategory,
                    [category]: totalProducts, // Store total products count for the category
                },
            };

        case actionTypes.FETCH_PRODUCTS_PAGINATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export const productsReducer = (state = initialValue, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.FETCH_PRODUCTS_SUCCESS:
            if (state.products === action.payload) {
                return state;  // No state change if the array is the same
            }
            return {
                ...state,
                loading: false,
                products: action.payload
            }
        case actionTypes.FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}


export const productDetailReducer = (state = { loading: false, productInfo: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.PRODUCT_DETAIL_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.PRODUCT_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                productInfo: action.payload
            }
        case actionTypes.PRODUCT_DETAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}

export const updateProductReducer = (state = { loading: false, product: {}, error: "" }, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload
            }
        case actionTypes.UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state
    }

}
