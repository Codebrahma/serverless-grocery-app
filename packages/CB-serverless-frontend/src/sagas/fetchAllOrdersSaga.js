import { call, put, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../service/order';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { fetchOrderAPI } = OrderService;

function* fetchOrder(action) {
  try {
    const userId = yield select(userIdSelector);
    const response = yield call(() => fetchOrderAPI(userId));

    const { resp } = response.data ? response.data : {};

    let pendingOrder = null;

    if (response.data.length > 0) {
      const idx = response.data.findIndex(order => order.orderStatus === 'PAYMENT_PENDING');
      pendingOrder = response.data[idx];
    }

    yield put({
      type: 'SAVE_ALL_ORDERS',
      payload: response.data,
      pendingOrder,
    });
  } catch (e) {
    console.log(e);
  }
}

function* fetchOrderSaga() {
  yield takeLatest('FETCH_ALL_ORDERS', fetchOrder);
}

export default fetchOrderSaga;
