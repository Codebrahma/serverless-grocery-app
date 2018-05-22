import axios from 'axios';
import { CART_DETAILS_URL, CART_URL } from './api_constants';

/**
 * Get current Cart for a user
 * @param userId {string} pass the userId for whom data is to be fetched
 * @return {AxiosPromise<any>}
 */
function getCart(userId) {
  const queryString = `?userId=${userId}`;
  return axios.get(CART_URL + queryString);
}

/**
 * Update Cart Items
 * @param userId {string} pass the userId for whom data is to be updated
 * @param data {array} array of items which will be added in cart
 * @return {AxiosPromise<any>}
 */
function updateCart(userId, data) {
  const postData = {
    userId,
    cartData: data,
  };
  return axios.post(CART_URL, postData);
}

function getCartDetails(userId) {
  const queryString = `?userId=${userId}`;
  return axios.get(CART_DETAILS_URL + queryString);
}

export default {
  getCart,
  getCartDetails,
  updateCart,
};
