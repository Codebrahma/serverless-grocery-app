import { call, put, select, takeLatest } from 'redux-saga/effects';
import CartService from '../../service/cart';

/**
 * Get userId value from redux store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { getCart, getCartDetails } = CartService;

function* cartItemsFetch(action) {
  // action to inform cart fetch in progress
  yield put({
    type: 'IN_PROGRESS',
  });
  try {
    // get userId value from store
    const userId = yield select(userIdSelector);

    // get cart for the user with the specified userid
    const response = yield call(() => getCart(userId));

    // get details of cart items
    let cartDetails = yield call(() => getCartDetails(userId));
    cartDetails = cartDetails.data.length > 0 ? cartDetails.data : [];

    const { cartData } = response.data.Item ? response.data.Item : [];

    // save the cart data for the user
    yield put({
      type: 'USER_CART_ITEMS',
      payload: {
        cartData,
      },
    });

    // save the cart items info
    yield put({
      type: 'SAVE_ITEM_INFO',
      payload: cartDetails || [],
    });
  } catch (e) {
    console.log(e);
    // in case of error set cart data as empty
    yield put({
      type: 'USER_CART_ITEMS',
      payload: {
        cartData: [],
      },
    });

    yield put({
      type: 'SAVE_ITEM_INFO',
      payload: [],
    });
  }
}

function* cartItemsFetchSaga() {
  yield takeLatest('FETCH_CART_ITEMS', cartItemsFetch);
}

export default cartItemsFetchSaga;
