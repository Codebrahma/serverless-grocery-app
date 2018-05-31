import { put, call, select, takeLatest } from 'redux-saga/effects';
import CartService from '../../service/cart';

/**
 * Get userId value from redux store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;
const { updateCart } = CartService;


function* cartItemsClean(action) {
  try {
    /**
     * Get userId from redux store
     */
    const userId = yield select(userIdSelector);

    // create a new empty cart
    const newCart = [];
    // send the empty cart to API and overwrite to an empty version
    const response = yield call(() => updateCart(userId, newCart));

    // send action to refect cart items from backend
    // response returned would be an empty cart in this case
    yield put({ type: 'FETCH_CART_ITEMS' });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga to handle action CLEAN_CART_ITEMS
 */
function* cartItemsCleanSaga() {
  yield takeLatest('CLEAN_CART_ITEMS', cartItemsClean);
}

export default cartItemsCleanSaga;
