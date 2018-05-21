import { put, call, select, takeLatest } from 'redux-saga/effects';
import CartService from '../service/cart';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { updateCart } = CartService;

function* cleanOrderAndPayment(action) {
  yield put({ type: 'CLEAR_ORDER' });
  yield put({ type: 'CLEAR_PAYMENT' });
}

function* cleanOrderSaga() {
  yield takeLatest('CLEAN_ORDER', cleanOrderAndPayment);
}

export default cleanOrderSaga;
