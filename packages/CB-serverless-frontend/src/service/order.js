import axios from 'axios';
import { ORDER_CANCEL_URL, ORDER_PENDING_URL, ORDER_URL } from './api_constants';

function placeOrderAPI(userId) {
  const data = {
    userId,
  };
  return axios.post(ORDER_URL, data);
}

function fetchOrderAPI(userId) {
  return axios.get(`${ORDER_PENDING_URL}?userId=${userId}`);
}

function cancelOrderAPI(userId, orderId) {
  const data = {
    userId,
    orderId,
  };
  return axios.post(ORDER_CANCEL_URL, data);
}

export default {
  placeOrderAPI,
  fetchOrderAPI,
  cancelOrderAPI,
};
