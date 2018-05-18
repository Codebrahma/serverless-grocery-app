import { call, select, takeLatest } from 'redux-saga/effects';
import CartService from '../service/cart';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const cartItemsSelector = state => state.cart.cartData;
const { updateCart } = CartService;

function* cartItemsAdd(action) {
  try {
    const userId = yield select(userIdSelector);
    const currentCart = yield select(cartItemsSelector);
    let newCart = [];
    newCart = [...currentCart, ...[action.payload]];
    console.log(typeof currentCart, currentCart, newCart);

    const response = yield call(() => updateCart(userId, newCart));
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
