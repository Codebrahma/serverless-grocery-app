import axios from 'axios';
import { API_BASE } from './api_constants';

const client = axios.create({
  baseURL: API_BASE,
});

/**
 * Request Wrapper with default success/error actions
 */
const request = function (options) {
  const onSuccess = function (response) {
    console.debug('Request Successful!', response);
    return response;
  };

  const onError = function (error) {
    console.error('Request Failed:', error.config);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
