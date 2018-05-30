import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

export const currentOrderSelector = createSelector(
  [
    (state) => {return (state.order.currentOrder || {});},
  ], (currentOrder) => {
    const isCurrentOrderEmpty = isEmpty(currentOrder);
    const {orderId, orderTotal, orderStatus} = currentOrder;
    return ({
      isCurrentOrderEmpty,
      orderId,
      orderTotal,
      orderStatus
    });
  }
)
