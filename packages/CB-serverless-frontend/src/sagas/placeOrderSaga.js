import { put, call, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../service/order';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { placeOrderAPI } = OrderService;

function* placeOrder(action) {
  try {
    const userId = yield select(userIdSelector);
    const response = yield call(() => placeOrderAPI(userId));

    const { resp } = response.data ? response.data : {};

    yield put({
      type: 'SAVE_ORDER_ID',
      payload: response.data,
    });

    yield put({
      type: 'FETCH_ALL_ORDERS',
    });
  } catch (e) {
    console.log(e);
  }
}

function* placeOrderSaga() {
  yield takeLatest('PLACE_ORDER', placeOrder);
}

export default placeOrderSaga;
