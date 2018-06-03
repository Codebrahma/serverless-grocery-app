import { put, takeLatest } from 'redux-saga/effects';

function* cleanOrderAndPayment(action) {
  // remove values in order reducer
  yield put({ type: 'CLEAR_ORDER' });
  // remove values in payment reducer
  yield put({ type: 'CLEAR_PAYMENT' });
}

/**
 * Saga to clear everything in order reducer and payment reducer
 */
function* cleanOrderSaga() {
  yield takeLatest('CLEAN_ORDER', cleanOrderAndPayment);
}

export default cleanOrderSaga;
