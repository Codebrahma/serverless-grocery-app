const initialState = {
  currentOrder: null,
  orderList: [],
  orderListFetched: false,
};

/**
  Store all order details in orderList and
  pending order in currentOrder
*/

export default (state = initialState, { type, payload = {}, ...rest }) => {
  switch (type) {
    case 'SAVE_ORDER_ID':
      return {
        ...state,
        currentOrder: payload,
      };
    case 'SAVE_ALL_ORDERS':
      return {
        ...state,
        orderList: payload,
        currentOrder: rest.pendingOrder,
        orderListFetched: true
      };
    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: [],
        orderList: [],
      };
    default:
      return state;
  }
};
