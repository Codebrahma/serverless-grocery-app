const initialState = {
  cartItems: [],
  lastCartSync: (new Date()).getTime(),
};

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case 'ADD_TO_CART':
      return {
        cartItems: state.cartItems.concat(payload),
      };
    case 'UPDATE_SYNC_TIME':
      return {
        lastCartSync: payload,
      };
    case 'SYNC_CART':
      return {
        cartItems: payload.cartItems,
        lastCartSync: payload.timestamp,
      };
    default:
      return state;
  }
};
