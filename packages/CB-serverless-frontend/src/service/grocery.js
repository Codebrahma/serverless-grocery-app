import { CATEGORY_URL, GROCERIES_URL, GROCERY_INFO_URL } from './api_constants';
import request from './request';

// Get top 3g groceries item for each category
// Shown on home page
export function getTop3Groceries() {
  return request({ url: GROCERIES_URL, method: 'GET' });
}

// Get info about particular grocery item based on id
export function getGroceryInfo(groceryId) {
  return request({ url: `${GROCERY_INFO_URL}?id=${groceryId}`, method: 'GET' });
}

// Get groceries for a particular category
export function getCategoryGroceries(category) {
  return request({ url: `${CATEGORY_URL + category}`, method: 'GET' });
}
