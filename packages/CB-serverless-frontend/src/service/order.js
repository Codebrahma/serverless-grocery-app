import { ORDER_CANCEL_URL, ORDER_PENDING_URL, ORDER_URL } from './api_constants';
import request from './request';

/**
 * API for placing order for the userId
 * @param userId
 */
function placeOrderAPI(userId) {
  const data = {
    userId,
  };
  return request({ url: ORDER_URL, method: 'POST', data });
}

/**
 * Fetch all order present for the userID
 * @param userId
 */
function fetchOrderAPI(userId) {
  return request({ url: `${ORDER_PENDING_URL}?userId=${userId}`, method: 'GET' });
}


/**
 * Cancel order with particular order Id
 * @param userId
 * @param orderId
 */
function cancelOrderAPI(userId, orderId) {
  const data = {
    userId,
    orderId,
  };
  return request({ url: ORDER_CANCEL_URL, method: 'POST', data });
}

export default {
  placeOrderAPI,
  fetchOrderAPI,
  cancelOrderAPI,
};
