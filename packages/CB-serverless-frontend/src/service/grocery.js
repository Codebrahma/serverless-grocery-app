import axios from 'axios';
import { GROCERY_INFO_URL } from './api_constants';

export function getGroceryInfo(groceryId) {
  return axios.get(`${GROCERY_INFO_URL}?id=${groceryId}`);
}
