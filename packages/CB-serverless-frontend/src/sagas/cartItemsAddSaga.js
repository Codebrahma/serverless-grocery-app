import { call, select, takeLatest, } from 'redux-saga/effects';
import CartService from '../service/cart';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { updateCart } = CartService;

function* cartItemsAdd(action) {
  try {
    const userId = yield select(userIdSelector);
    const response = yield call(() => updateCart(userId, action.payload));
    const { resp } = response.data ? response.data : {};
    console.log('saga resp on update', resp, response);
  } catch (e) {
    console.log(e);
  }
}

function* cartItemsAddSaga() {
  yield takeLatest('UPDATE_CART_ITEMS', cartItemsAdd);
}

export default cartItemsAddSaga;
