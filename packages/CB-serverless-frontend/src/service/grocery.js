import axios from 'axios';
import { CATEGORY_URL, GROCERIES_URL, GROCERY_INFO_URL } from './api_constants';
import request from './request';

export function getTop3Groceries() {
  return request({url: GROCERIES_URL, method: 'GET'});
}

export function getGroceryInfo(groceryId) {
  return request({url: `${GROCERY_INFO_URL}?id=${groceryId}`, method: 'GET'});
}

export function getCategoryGroceries(category) {
  return request({url: `${CATEGORY_URL + category}`, method: 'GET'});
}
