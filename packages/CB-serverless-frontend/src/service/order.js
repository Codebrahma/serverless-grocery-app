import axios from 'axios';
import { ORDER_URL } from './api_constants';

function placeOrderAPI(userId) {
  const data = {
    userId,
  };
  return axios.post(ORDER_URL, data);
}

export default {
  placeOrderAPI,
};
