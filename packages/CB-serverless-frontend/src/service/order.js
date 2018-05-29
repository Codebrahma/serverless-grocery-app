import axios from 'axios';
import { ORDER_CANCEL_URL, ORDER_PENDING_URL, ORDER_URL } from './api_constants';
import request from './request';

function placeOrderAPI(userId) {
  const data = {
    userId,
  };
  return request({url: ORDER_URL, method: 'POST', data});
}

function fetchOrderAPI(userId) {
  return request({url: `${ORDER_PENDING_URL}?userId=${userId}`, method: 'GET'});
}

function cancelOrderAPI(userId, orderId) {
  const data = {
    userId,
    orderId,
  };
  return request({url: ORDER_CANCEL_URL, method: 'POST', data});
}

export default {
  placeOrderAPI,
  fetchOrderAPI,
  cancelOrderAPI,
};
