import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { API, Auth } from 'aws-amplify';
import axios from 'axios';
import PaymentRequests from '../service/payment';

const {submitPaymentRequest} = PaymentRequests;

function* submitPayment(action) {
  const { tokenId, orderId, email, userId } = action.payload;
  if (!tokenId || !orderId) return ;
  const payload = {
    email,
	  stripeId: tokenId,
	  orderId,
    userId
  };
  yield put({
    type: 'PAYMENT_IN_PROGRESS'
  })
  try {
    const response =  yield call(() => submitPaymentRequest(payload));
    const {data} = response;
    if (data.success) {
      yield put({
        type: 'PAYMENT_SUCCESS'
      })
      yield put({
        type: 'FETCH_ALL_ORDERS',
      });
    }
    else
      yield put({
        type: 'PAYMENT_FAILURE',
        payload: {error: data.error}
      })
  } catch(e) {
    yield put({
      type: 'PAYMENT_FAILURE',
      payload: {error: 'Something went wrong, Please try again.'}
    })
  }
}

function* paymentTokenIdSubmitSaga() {
  yield takeLatest('SUBMIT_PAYMENT_TOKEN_ID', submitPayment);
}

export default paymentTokenIdSubmitSaga;
