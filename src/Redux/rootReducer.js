// rootReducer.js
import { combineReducers } from 'redux';
import { userLoginReducer, deliveryStaffLoginReducer } from './Reducers/loginReducer'; // Import LoginReducer
import { userReducer, userDetailReducer, updateUserReducer, updateUserDPReducer, deleteUserReducer } from './Reducers/userReducer'; // Import user Reducer
import { deliveryStaffReducer, deliveryStaffDetailReducer, updateDeliveryStaffReducer, updateDeliveryStaffDPReducer, deleteDeliveryStaffReducer } from './Reducers/deliveryStaffReducer'; // Import deliveryStaff Reducer
import { categorysReducer, categoryProductReducer, categoryDetailReducer, limitedCategorysReducer } from './Reducers/categoryReducer'; // Import category Reducer
import { brandDetailReducer, brandProductReducer, brandsReducer, limitedBrandsReducer } from './Reducers/brandReducer'; // Import brand Reducer
import { productsReducer, productsPaginationReducer, productDetailReducer, updateProductReducer } from './Reducers/productReducer'; // Import product Reducer
import { recent_ordersReducer, recent_orderDetailReducer, updateRecent_orderReducer } from './Reducers/recentOrderReducer'; // Import recent_order Reducer
import { bannerDetailReducer, bannersReducer } from './Reducers/bannerReducer'; // Import banner Reducer
import { promoDetailReducer, promosReducer } from './Reducers/promoReducer'; // Import banner Reducer
import { ordersReducer, createOrdersReducer, orderDetailReducer, deleteOrderReducer, updateOrderReducer, assignedOrdersReducer } from './Reducers/orderReducer'; // Import order Reducer
import { runningOrderReducer } from './Reducers/running_orderReducer'; // Import order Reducer
import { cartsReducer, createCartsReducer, createReorderedCartsReducer, updateCartReducer, cartDetailReducer, deleteCartReducer, deleteCartByVarientReducer,cartProductsReducer } from './Reducers/cartReducer'; // Import cart Reducer
import { cartItemsReducer } from './Reducers/cartItemsReducer'; // Import cart Reducer
import { addressDetailReducer, addressesReducer, createAddressReducer, deleteAddressReducer, updateAddressReducer } from './Reducers/addressReducer'; // Import address Reducer
import { wishlistsReducer, createWishlistsReducer, wishlistDetailReducer, updateWishlistReducer, deleteWishlistReducer } from './Reducers/wishlistReducer'; // Import wishlist Reducer
import { couponsReducer, couponDetailReducer } from './Reducers/couponReducer'; // Import coupon Reducer
import { notificationReducer, staffNotificationReducer, singleNotificationReducer } from './Reducers/notificationReducer'; // Import coupon Reducer
import { ticketReducer, createTicketReducer, deleteTicketReducer, ticketDetailReducer, updateTicketReducer } from "./Reducers/ticketReducer";
import { requestReducer, createRequestReducer, deleteRequestReducer, requestDetailReducer, updateRequestReducer, pendingRequestReducer } from "./Reducers/requestReducer";
import { createReviewReducer, reviewReducer, singleReviewReducer } from "./Reducers/reviewReducer";
import { imageCountsReducer } from "./Reducers/imageCountReducer";
import { userPincodeReducer } from "./Reducers/pincodeCheckReducer";


// Combine reducers and assign them to keys
const rootReducer = combineReducers({
  userLogin: userLoginReducer,  // The key 'userLogin' must match the state selector used
  user: userReducer, // The key 'users' must match the state selector used
  pincodeCheck: userPincodeReducer, // The key 'users' must match the state selector used
  userDetails: userDetailReducer,  // The key 'users' must match the state selector used
  updateUserDetails: updateUserReducer,  // The key 'users' must match the state selector used
  updateUserDP: updateUserDPReducer,  // The key 'users' must match the state selector used
  updateUserStatus: deleteUserReducer, // The key 'users' must match the state selector used
  deliveryStaffLogin: deliveryStaffLoginReducer,  // The key 'deliveryStaffLogin' must match the state selector used
  deliveryStaff: deliveryStaffReducer, // The key 'deliveryStaffs' must match the state selector used
  deliveryStaffDetails: deliveryStaffDetailReducer,  // The key 'deliveryStaffs' must match the state selector used
  updateDeliveryStaffDetails: updateDeliveryStaffReducer,  // The key 'deliveryStaffs' must match the state selector used
  updateDeliveryStaffDP: updateDeliveryStaffDPReducer,  // The key 'deliveryStaffs' must match the state selector used
  updateDeliveryStaffStatus: deleteDeliveryStaffReducer, // The key 'deliveryStaffs' must match the state selector used
  products: productsReducer,  // The key 'product' must match the state selector used
  productsPaginationByCategory: productsPaginationReducer,  // The key 'product' must match the state selector used
  productInfo: productDetailReducer,  // The key 'product' must match the state selector used
  productUpdate: updateProductReducer,  // The key 'product' must match the state selector used
  recentOrders: recent_ordersReducer,  // The key 'recent_order' must match the state selector used
  recent_orderInfo: recent_orderDetailReducer,  // The key 'recent_order' must match the state selector used
  recent_orderUpdate: updateRecent_orderReducer,  // The key 'recent_order' must match the state selector used
  categorys: categorysReducer,  // The key 'categorys' must match the state selector used
  categorysLimited: limitedCategorysReducer,  // The key 'categorys' must match the state selector used
  categoryProducts: categoryProductReducer,  // The key 'categorys' must match the state selector used
  categoryDetails: categoryDetailReducer,  // The key 'categorys' must match the state selector used
  brands: brandsReducer,  // The key 'brands' must match the state selector used
  brandsLimited: limitedBrandsReducer,  // The key 'brands' must match the state selector used
  brandProducts: brandProductReducer,  // The key 'brands' must match the state selector used
  brandDetails: brandDetailReducer,  // The key 'brands' must match the state selector used
  promos: promosReducer,  // The key 'promos' must match the state selector used
  promosDetails: promoDetailReducer,  // The key 'promos' must match the state selector used
  banners: bannersReducer,  // The key 'banners' must match the state selector used
  bannersDetails: bannerDetailReducer,  // The key 'banners' must match the state selector used
  coupons: couponsReducer,  // The key 'coupons' must match the state selector used
  couponsDetails: couponDetailReducer,  // The key 'coupons' must match the state selector used
  notifications: notificationReducer,  // The key 'notification' must match the state selector used
  staffNotifications: staffNotificationReducer,  // The key 'notification' must match the state selector used
  notificationDetails: singleNotificationReducer,  // The key 'notification' must match the state selector used
  orders: ordersReducer,  // The key 'orders' must match the state selector used
  orderAdd: createOrdersReducer,  // The key 'orders' must match the state selector used
  orderUpdate: updateOrderReducer,  // The key 'order' must match the state selector used
  orderDetails: orderDetailReducer,  // The key 'orders' must match the state selector used
  runningOrder: runningOrderReducer,  // The key 'orders' must match the state selector used
  assignedOrders: assignedOrdersReducer,  // The key 'orders' must match the state selector used
  cartItems: cartItemsReducer,  // The key 'carts' must match the state selector used
  carts: cartsReducer,  // The key 'carts' must match the state selector used
  cartAdd: createCartsReducer,  // The key 'carts' must match the state selector used
  reorderedCart: createReorderedCartsReducer,  // The key 'carts' must match the state selector used
  cartUpdate: updateCartReducer,  // The key 'product' must match the state selector used
  cartDetails: cartDetailReducer,  // The key 'carts' must match the state selector used
  cartProduct: cartProductsReducer,  // The key 'carts' must match the state selector used
  cartDelete: deleteCartReducer,  // The key 'carts' must match the state selector used
  cartVarientDelete: deleteCartByVarientReducer,  // The key 'carts' must match the state selector used
  addresses: addressesReducer,  // The key 'addresses' must match the state selector used
  addressAdd: createAddressReducer,  // The key 'addresses' must match the state selector used
  addressUpdate: updateAddressReducer,  // The key 'product' must match the state selector used
  addressDetails: addressDetailReducer,  // The key 'addresses' must match the state selector used
  addressDelete: deleteAddressReducer,  // The key 'addresses' must match the state selector used
  wishlists: wishlistsReducer,  // The key 'wishlists' must match the state selector used
  wishlistAdd: createWishlistsReducer,  // The key 'wishlists' must match the state selector used
  wishlistUpdate: updateWishlistReducer,  // The key 'wishlist' must match the state selector used
  wishlistDetails: wishlistDetailReducer,  // The key 'wishlists' must match the state selector used
  wishlistDelete: deleteWishlistReducer,  // The key 'wishlists' must match the state selector used
  tickets: ticketReducer,  // The key 'wishlists' must match the state selector used
  ticketAdd: createTicketReducer,  // The key 'wishlists' must match the state selector used
  ticketUpdate: updateTicketReducer,  // The key 'wishlist' must match the state selector used
  ticketDetails: ticketDetailReducer,  // The key 'wishlists' must match the state selector used
  ticketDelete: deleteTicketReducer,  // The key 'wishlists' must match the state selector used
  requests: requestReducer,  // The key 'wishlists' must match the state selector used
  requestAdd: createRequestReducer,  // The key 'wishlists' must match the state selector used
  pendingRequest: pendingRequestReducer,  // The key 'wishlists' must match the state selector used
  requestUpdate: updateRequestReducer,  // The key 'wishlist' must match the state selector used
  requestDetails: requestDetailReducer,  // The key 'wishlists' must match the state selector used
  requestDelete: deleteRequestReducer,  // The key 'wishlists' must match the state selector used
  reviewDetail: singleReviewReducer,  // The key 'wishlist' must match the state selector used
  reviews: reviewReducer,  // The key 'wishlists' must match the state selector used
  createReview: createReviewReducer,  // The key 'wishlists' must match the state selector used
  initialImageCount: imageCountsReducer,  // The key 'wishlists' must match the state selector used
});

export default rootReducer;
