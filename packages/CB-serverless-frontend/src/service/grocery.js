import axios from 'axios';
import { authHeaders, CATEGORY_URL, GROCERIES_URL, GROCERY_INFO_URL } from './api_constants';

export function getTop3Groceries() {
  return axios.get(`${GROCERIES_URL}`);
}

export function getGroceryInfo(groceryId) {
  return axios.get(`${GROCERY_INFO_URL}?id=${groceryId}`);
}

export function getCategoryGroceries(category) {
  return axios.get(`${CATEGORY_URL + category}`);
}
