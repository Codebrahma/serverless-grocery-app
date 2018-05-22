import { isEmpty, isNil } from 'lodash';

const LOCAL_API_BASE = 'http://localhost:3000';
const API_BASE = 'https://ki9zw0fyi2.execute-api.ap-south-1.amazonaws.com/dev';

export const GROCERY_INFO_URL = `${API_BASE}/grocery`;
export const GROCERIES_URL = `${API_BASE}/groceries`;
export const CATEGORY_URL = `${GROCERIES_URL}?category=`;
export const CART_URL = `${API_BASE}/cart`;
export const PAYMENT_URL = `${API_BASE}/pay`;
export const ORDER_URL = `${API_BASE}/createOrder`;


export const getToken = () => {
  const session = localStorage.getItem('userSession');
  if (!isNil(session) && !isEmpty(session) && !isNil(session)) {
    return JSON.parse(session).signInUserSession;
  }
  return {};
};

export const getAccessToken = () => {
  const obj = getToken();
  if (!isNil(obj) && !isNil(obj.accessToken)) { return obj.accessToken.jwtToken; }
  return null;
};


export const getIdToken = () => {
  const obj = getToken();
  if (!isNil(obj) && !isNil(obj.idToken)) { return obj.idToken.jwtToken; }
  return null;
};


export const authHeaders = () => ({
  headers: {
    Authorization: getIdToken(),
  },
});
