import { call, put, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../service/order';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const orderIdSelector = (state) => {
  if (state.order && state.order.orderList) {
    const { orderList } = state.order;
    if (orderList.length > 0) {
      const idx = orderList.findIndex(order => order.orderStatus === 'PAYMENT_PENDING');
      if (idx >= 0) {
        return (orderList[idx].orderId || -1);
      }
      return -1;
    }
    return -1;
  }
  return -1;
};
const { cancelOrderAPI } = OrderService;

function* cancelOrder(action) {
  try {
    const userId = yield select(userIdSelector);
    const orderId = yield select(orderIdSelector);

    // Don't make any request if there's no pending order
    if (orderId !== -1) {
      const response = yield call(() => cancelOrderAPI(userId, orderId));

      const { resp } = response.data ? response.data : {};

      yield put({
        type: 'FETCH_ALL_ORDERS',
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function* cancelOrderSaga() {
  yield takeLatest('CANCEL_ORDER', cancelOrder);
}

export default cancelOrderSaga;
