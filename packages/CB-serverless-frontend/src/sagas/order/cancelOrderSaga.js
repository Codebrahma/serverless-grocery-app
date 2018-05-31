import { call, put, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../../service/order';

/**
 * Get userid from store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;

/**
 * Get the 'first' order whose status is payment pending and return its ID
 * at a time only one order will be in pending status
 */
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
    // get userid from store
    const userId = yield select(userIdSelector);

    // get the order id
    const orderId = yield select(orderIdSelector);

    // Don't make any request if there's no pending order;
    if (orderId !== -1) {
      // send the order ID onto server to cancel the order at backend
      const response = yield call(() => cancelOrderAPI(userId, orderId));

      const { resp } = response.data ? response.data : {};

      // send an action to fetch an updated list of all order
      yield put({
        type: 'FETCH_ALL_ORDERS',
      });
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga to handle the order cancel action
 */
function* cancelOrderSaga() {
  yield takeLatest('CANCEL_ORDER', cancelOrder);
}

export default cancelOrderSaga;
