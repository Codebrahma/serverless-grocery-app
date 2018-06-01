import { CART_DETAILS_URL, CART_URL } from './api_constants';
import request from './request';

/**
 * Get current Cart for a user
 * @param userId {string} pass the userId for whom data is to be fetched
 */
function getCart(userId) {
  const queryString = `?userId=${userId}`;
  return request({ url: `${CART_URL}${queryString}`, method: 'GET' });
}

/**
 * Update Cart Items
 * @param userId {string} pass the userId for whom data is to be updated
 * @param data {array} array of items which will be added in cart
 */
function updateCart(userId, data) {
  const postData = {
    userId,
    cartData: data,
  };
  return request({ url: CART_URL, method: 'POST', data: postData });
}

/**
 * Get cart for the user
 * @param userId
 */
function getCartDetails(userId) {
  const queryString = `?userId=${userId}`;
  return request({ url: `${CART_DETAILS_URL}${queryString}`, method: 'GET' });
}

export default {
  getCart,
  getCartDetails,
  updateCart,
};
