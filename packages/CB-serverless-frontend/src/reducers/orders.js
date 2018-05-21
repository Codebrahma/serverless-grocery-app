const initialState = {
  currentOrder: null,
  orderList: [],
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case 'SAVE_ORDER_ID':
      return {
        ...state,
        currentOrder: payload,
      };
    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: initialState.currentOrder,
        orderList: initialState.orderList
      };
    default:
      return state;
  }
};
