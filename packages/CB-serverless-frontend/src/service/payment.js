import axios from 'axios';
import { PAYMENT_URL } from './api_constants';

/**
  * Submit tokenId for the order payment
  * @param userId {string} pass the userId for whom data is to be fetched
  * @return {AxiosPromise<any>}
 */
function submitPaymentRequest(body) {
   return axios.post(PAYMENT_URL, body);
}

export default {
   submitPaymentRequest,
 };
