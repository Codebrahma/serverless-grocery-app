import { call, put, select, takeLatest } from 'redux-saga/effects';
import CartService from '../../service/cart';

/**
 * Get userId value from redux store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;

/**
 * Get cart items value from store
 */
const cartItemsSelector = state => state.cart.cartData;

const { updateCart, getCartDetails } = CartService;

function* cartItemUpdateQty(action) {
  try {
    // get userId from store
    const userId = yield select(userIdSelector);

    // get current cart value from store
    const currentCart = yield select(cartItemsSelector);

    // create new cart with updated item quantity
    const newCart = currentCart.map((obj) => {
      if (obj.groceryId === action.payload.groceryId) {
        const newObj = obj;
        newObj.qty = action.payload.qty;
        return newObj;
      }
      return obj;
    });

    // send the updated cart to backend
    const response = yield call(() => updateCart(userId, newCart));
    const { resp } = response.data ? response.data : {};

    // get details of new cart items
    const cartDetails = yield call(() => getCartDetails(userId));

    // send action to save cart items in store
    yield put({ type: 'SAVE_NEW_CART', payload: response.data.Attributes.cartData });

    // send action to save cart items details in store
    yield put({
      type: 'SAVE_ITEM_INFO',
      payload: cartDetails.data || [],
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 *  Saga to handle cart item quantity change
 */
function* cartItemUpdateQtySaga() {
  yield takeLatest('UPDATE_CART_ITEM_QTY', cartItemUpdateQty);
}

export default cartItemUpdateQtySaga;
