import { fork } from 'redux-saga/effects';
import attemptLoginSaga from './attemptLoginSaga';
import verifyUserSaga from './verifyUserSaga';
import forgotPasswordRequestSaga from './forgotPasswordRequestSaga';
import forgotPasswordSaga from './forgotPasswordSaga';
import requestVerificationCodeSaga from './requestVerificationCodeSaga';
import cartItemsFetchSaga from './cartItemsFetchSaga';
import cartItemsAddSaga from './cartItemsAddSaga';
import cartItemsDeleteSaga from './cartItemsDeleteSaga';
import cartItemUpdateQtySaga from './cartItemsUpdateQtySaga';
import cartItemsCleanSaga from './cartItemsCleanSaga';
import placeOrderSaga from './placeOrderSaga';
import cleanOrderSaga from './cleanOrderSaga';
import paymentTokenIdSubmitSaga from './paymentTokenIdSubmitSaga';
import fetchOrderSaga from './fetchAllOrdersSaga';
import cancelOrderSaga from './cancelOrderSaga';

function* rootSaga() {
  yield fork(attemptLoginSaga);
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
