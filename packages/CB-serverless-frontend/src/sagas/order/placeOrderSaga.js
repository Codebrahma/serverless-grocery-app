import { put, call, select, takeLatest } from 'redux-saga/effects';
import OrderService from '../../service/order';

// get userId from store
const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { placeOrderAPI } = OrderService;

function* placeOrder(action) {
  try {
    const userId = yield select(userIdSelector);

    // make request to backend to place an order
    // order will be created for all items present in cart
    // reponse contains order Id and total amount
    const response = yield call(() => placeOrderAPI(userId));

    const { resp } = response.data ? response.data : {};

    // Save newly placed Order info
    yield put({
      type: 'SAVE_ORDER_ID',
      payload: response.data,
    });

    // send action to refetch all order
    yield put({
      type: 'FETCH_ALL_ORDERS',
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga to handle order placing
 */
function* placeOrderSaga() {
  yield takeLatest('PLACE_ORDER', placeOrder);
}

export default placeOrderSaga;
