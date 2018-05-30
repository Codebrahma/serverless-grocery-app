import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

export const cartDataSelector = createSelector(
  [
    (state) => {return (state.cart.cartData || []);},
  ], (cartData) => {
    const isCartDataEmpty = isEmpty(cartData);
    const cartDataLength = cartData.length;
    return ({
      isCartDataEmpty,
      cartDataLength,
      cartData
    });
  }
)
