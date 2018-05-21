import { fork } from 'redux-saga/effects';
import attemptLoginSaga from './attemptLoginSaga';
import cartItemsFetchSaga from './cartItemsFetchSaga';
import cartItemsAddSaga from './cartItemsAddSaga';
import cartItemsDeleteSaga from './cartItemsDeleteSaga';
import cartItemUpdateQtySaga from './cartItemsUpdateQtySaga';
import cartItemsCleanSaga from './cartItemsCleanSaga';
import placeOrderSaga from './placeOrderSaga';
import cleanOrderSaga from './cleanOrderSaga';
import paymentTokenIdSubmitSaga from './paymentTokenIdSubmitSaga';

function* rootSaga() {
  yield fork(attemptLoginSaga);
  yield fork(cartItemsFetchSaga);
  yield fork(cartItemsAddSaga);
  yield fork(cartItemsDeleteSaga);
  yield fork(cartItemUpdateQtySaga);
  yield fork(cartItemsCleanSaga);
  yield fork(placeOrderSaga);
  yield fork(cleanOrderSaga);
  yield fork(paymentTokenIdSubmitSaga);
}

export default rootSaga;
