import { PAYMENT_URL } from './api_constants';
import request from './request';

/**
  * Submit tokenId for the order payment
  * @param userId {string} pass the userId for whom data is to be fetched
  * @return {AxiosPromise<any>}
 */
function submitPaymentRequest(data) {
  return request({ url: PAYMENT_URL, method: 'POST', data });
}

export default {
  submitPaymentRequest,
};
