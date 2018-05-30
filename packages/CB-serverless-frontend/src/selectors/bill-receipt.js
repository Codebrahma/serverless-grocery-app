import { createSelector } from 'reselect';

import {cartItemsInfoSelector} from './common/cart-items-info';
import {currentOrderSelector} from './common/current-order';
import {userDataSelector} from './common/user-data';

export const billReceiptSelector = createSelector(
  [
    cartItemsInfoSelector,
    currentOrderSelector,
    (state) => state.payment.paymentComplete,
    (state) => {return (state.payment.paymentInProgress || false);},
    userDataSelector
  ], ({cartItemsInfo}, {isCurrentOrderEmpty, orderId, orderTotal},
      paymentComplete, paymentInProgress, {username}) => {
    return ({
      isCurrentOrderEmpty,
      orderId,
      orderTotal,
      cartItems: cartItemsInfo,
      paymentInProgress,
      paymentComplete,
      username
    });
  }
)
