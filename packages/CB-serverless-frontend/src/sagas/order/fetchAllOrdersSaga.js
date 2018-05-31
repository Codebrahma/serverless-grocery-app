import { call, put, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../../service/order';

// get userId from store
const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { fetchOrderAPI } = OrderService;

function* fetchOrder(action) {
  try {
    const userId = yield select(userIdSelector);

    // get all order for the userId
    const response = yield call(() => fetchOrderAPI(userId));

    const { resp } = response.data ? response.data : {};

    let pendingOrder = null;

    // if orders present
    if (response.data.length > 0) {
      // get the order which is in pending state and save in 'currentOrder' in order store
      const idx = response.data.findIndex(order => order.orderStatus === 'PAYMENT_PENDING');
      pendingOrder = response.data[idx];
    }

    // send action to save info in store
    yield put({
      type: 'SAVE_ALL_ORDERS',
      payload: response.data,
      pendingOrder: pendingOrder || null,
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga to handle all order fetching
 */
function* fetchOrderSaga() {
  yield takeLatest('FETCH_ALL_ORDERS', fetchOrder);
}

export default fetchOrderSaga;
