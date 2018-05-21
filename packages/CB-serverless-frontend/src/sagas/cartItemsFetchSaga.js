import { call, put, select, takeLatest, } from 'redux-saga/effects';
import CartService from '../service/cart';

const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { getCart } = CartService;

function* cartItemsFetch(action) {
  try {
    const userId = yield select(userIdSelector);
    const response = yield call(() => getCart(userId));
    const { cartData } = response.data.Item ? response.data.Item : {};
    yield put({
      type: 'USER_CART_ITEMS',
      payload: {
        cartData,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function* cartItemsFetchSaga() {
  yield takeLatest('FETCH_CART_ITEMS', cartItemsFetch);
}

export default cartItemsFetchSaga;
