import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

export const cartItemsInfoSelector = createSelector(
  [
    (state) => {return (state.cart.cartItemsInfo || []);},
  ], (cartItemsInfo) => {
    const isCartItemsInfoEmpty = isEmpty(cartItemsInfo);
    const totalBill = cartItemsInfo.reduce((total, cur) => total += cur.price * cur.qty, 0);
    return ({
      cartItemsInfo,
      isCartItemsInfoEmpty,
      totalBill,
    });
  }
)
