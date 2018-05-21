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
    default:
      return state;
  }
};
