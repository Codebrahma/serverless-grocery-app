import { fork } from 'redux-saga/effects';

import authenticationSaga from './auth/authenticationSaga';
import verifyUserSaga from './auth/verifyUserSaga';
import forgotPasswordRequestSaga from './auth/forgotPasswordRequestSaga';
import forgotPasswordSaga from './auth/forgotPasswordSaga';
import requestVerificationCodeSaga from './auth/requestVerificationCodeSaga';
import cartItemsFetchSaga from './cart/cartItemsFetchSaga';
import cartItemsAddSaga from './cart/cartItemsAddSaga';
import cartItemsDeleteSaga from './cart/cartItemsDeleteSaga';
import cartItemUpdateQtySaga from './cart/cartItemsUpdateQtySaga';
import cartItemsCleanSaga from './cart/cartItemsCleanSaga';

import placeOrderSaga from './order/placeOrderSaga';
import cleanOrderSaga from './order/cleanOrderSaga';
import fetchOrderSaga from './order/fetchAllOrdersSaga';
import cancelOrderSaga from './order/cancelOrderSaga';

import paymentTokenIdSubmitSaga from './payment/paymentTokenIdSubmitSaga';

function* rootSaga() {
  yield fork(authenticationSaga);
  yield fork(verifyUserSaga);
  yield fork(forgotPasswordRequestSaga);
  yield fork(forgotPasswordSaga);
  yield fork(cartItemsFetchSaga);
  yield fork(cartItemsAddSaga);
  yield fork(cartItemsDeleteSaga);
  yield fork(cartItemUpdateQtySaga);
  yield fork(cartItemsCleanSaga);
  yield fork(placeOrderSaga);
  yield fork(cleanOrderSaga);
  yield fork(paymentTokenIdSubmitSaga);
  yield fork(fetchOrderSaga);
  yield fork(cancelOrderSaga);
  yield fork(requestVerificationCodeSaga);
}

export default rootSaga;
