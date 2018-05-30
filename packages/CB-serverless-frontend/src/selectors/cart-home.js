import { createSelector } from 'reselect';
import {cartItemsInfoSelector} from './common/cart-items-info';
import {currentOrderSelector} from './common/current-order';
import {userDataSelector} from './common/user-data';
import {cartDataSelector} from './common/cart-data';

export const cartHomeSelector = createSelector(
  [
    cartDataSelector,
    cartItemsInfoSelector,
    currentOrderSelector,
    userDataSelector,
    (state) => state.payment.paymentComplete,
    (state) => {return (state.payment.paymentInProgress || false);},
  ], ({isCartDataEmpty, cartData}, {cartItemsInfo, isCartItemsInfoEmpty, totalBill},
    {isCurrentOrderEmpty, orderId, orderStatus, orderTotal}, {username},
    paymentComplete, paymentInProgress) => {
    return ({
      isCurrentOrderEmpty,
      orderTotal,
      orderStatus,
      orderId,
      paymentInProgress,
      username,
      isCartItemsInfoEmpty,
      cartItemsInfo,
      cartItems: cartData,
      totalBill,
      isCartItemsEmpty: isCartDataEmpty,
      paymentComplete,
    });
  }
)
