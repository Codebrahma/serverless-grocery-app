import { put, call, select, takeLatest } from 'redux-saga/effects';
import CartService from '../../service/cart';
import { deDupeItems } from '../../utils/array';

/**
 * Get username value from redux store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;

/**
 * Get current cart items from the store
 */
const cartItemsSelector = state => state.cart.cartData || [];

const { updateCart } = CartService;

/**
 * saga called on action
 */
function* cartItemsAdd(action) {
  try {
    // get username from the store
    const userId = yield select(userIdSelector);

    // get current Cart items from store
    const currentCart = yield select(cartItemsSelector);

    // Create new empty cart
    let newCart = [];
    // merge the current cart with the newly added item
    newCart = deDupeItems([...currentCart, ...[action.payload]]);

    // Make API request to update cart at backend for that user
    const response = yield call(() => updateCart(userId, newCart));
    const { resp } = response.data ? response.data : {};

    // trigger the action which will fetch new cart data from backend
    yield put({ type: 'FETCH_CART_ITEMS' });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga which handles the action UPDATE_CART_ITEMS
 */
function* cartItemsAddSaga() {
  yield takeLatest('UPDATE_CART_ITEMS', cartItemsAdd);
}

export default cartItemsAddSaga;
