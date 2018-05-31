import { createSelector } from 'reselect';
import {userDataSelector} from './common/user-data';

import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

export const orderListSelector = createSelector(
  [
    (state) => state.order.orderList,
    (state) => state.order.orderListFetched,
    (state) => {return (state.order.currentOrder || {});},
    userDataSelector,
    (state) => state.payment.paymentInProgress,
    (state) => state.payment.paymentComplete,
  ], (orderList, orderListFetched, currentOrder, {username}, paymentInProgress, paymentComplete) => {
    const isOrderlistEmpty = isEmpty(orderList);
    const sortedOrderList = isOrderlistEmpty? [] : sortBy(orderList, (item) => {
      const timeStamp = new Date(item.orderDate);
      const inMillisec = timeStamp.getTime();
      return -inMillisec;
    });
    const {orderTotal, orderId} = currentOrder;
    return ({
      orderList: sortedOrderList,
      isOrderlistEmpty,
      orderListFetched,
      orderTotal,
      orderId,
      username,
      paymentInProgress,
      paymentComplete
    });
  }
)
