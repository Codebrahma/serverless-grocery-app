import { createSelector } from 'reselect';
import {cartDataSelector} from './common/cart-data';

export const headerSelector = createSelector(
  [
    cartDataSelector,
    (state) => state.order.orderListFetched,
  ], ({isCartDataEmpty, cartDataLength}, orderListFetched) => {
      return {orderListFetched, cartDataLength, isCartDataEmpty};
  }
)
