import { call, put, select, takeLatest } from 'redux-saga/effects';
import CartService from '../../service/cart';

/**
 * Get userId value from redux store
 */
const userIdSelector = state => state.auth.userData && state.auth.userData.username;

/**
 * Get Cart Items from redux store
 */
const cartItemsSelector = state => state.cart.cartData || [];
const { updateCart, getCartDetails } = CartService;

function* cartItemDelete(action) {
  try {
    // get userId from store
    const userId = yield select(userIdSelector);

    // get current cart values from the store
    const currentCart = yield select(cartItemsSelector);

    // create a new cart without the deleted cart item
    const newCart = currentCart.filter(obj => obj.groceryId !== action.payload);

    // send the new Cart version to backend to update the cart
    const response = yield call(() => updateCart(userId, newCart));
    const { resp } = response.data ? response.data : {};

    // get details of cart items which are present in cart
    // details include image url, price, category etc
    let cartDetails = yield call(() => getCartDetails(userId));

    // if more than 1 cart Details present set to value else an empty array
    cartDetails = cartDetails.data.length > 0 ? cartDetails.data : [];

    // Save the new received cart from backend
    yield put({ type: 'SAVE_NEW_CART', payload: response.data.Attributes.cartData });

    // Save the details of new cart items
    yield put({ type: 'SAVE_NEW_CART_INFO', payload: cartDetails || [] });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Saga to handle the action of deleting a cart item
 */
function* cartItemsDeleteSaga() {
  yield takeLatest('DELETE_CART_ITEM', cartItemDelete);
}

export default cartItemsDeleteSaga;
