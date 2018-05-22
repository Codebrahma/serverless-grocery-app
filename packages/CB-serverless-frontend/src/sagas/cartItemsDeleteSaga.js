import { put, call, select, takeLatest } from 'redux-saga/effects';
import CartService from '../service/cart';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const cartItemsSelector = state => state.cart.cartData || [];
const cartItemsInfoSelector = state => state.cart.cartItemsInfo || [];
const { updateCart } = CartService;

function* cartItemDelete(action) {
  try {
    const userId = yield select(userIdSelector);
    const currentCart = yield select(cartItemsSelector);
    const currentCartInfo = yield select(cartItemsInfoSelector);

    const newCart = currentCart.filter(obj => obj.groceryId !== action.payload);

    const newCartItemsInfo = currentCartInfo.filter(obj => obj.groceryId !== action.payload);

    const response = yield call(() => updateCart(userId, newCart));
    const { resp } = response.data ? response.data : {};


    yield put({ type: 'SAVE_NEW_CART', payload: response.data.Attributes.cartData });

    yield put({ type: 'SAVE_NEW_CART_INFO', payload: newCartItemsInfo });

  } catch (e) {
    console.log(e);
  }
}

function* cartItemsDeleteSaga() {
  yield takeLatest('DELETE_CART_ITEM', cartItemDelete);
}

export default cartItemsDeleteSaga;
