import { put, call, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../service/order';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { fetchOrderAPI } = OrderService;

function* fetchOrder(action) {
  try {
    const userId = yield select(userIdSelector);
    const response = yield call(() => fetchOrderAPI(userId));

    const { resp } = response.data ? response.data : {};

    yield put({
      type: 'SAVE_PENDING_ORDERS',
      payload: response.data,
    });
  } catch (e) {
    console.log(e);
  }
}

function* fetchOrderSaga() {
  yield takeLatest('FETCH_PENDING_ORDERS', fetchOrder);
}

export default fetchOrderSaga;
