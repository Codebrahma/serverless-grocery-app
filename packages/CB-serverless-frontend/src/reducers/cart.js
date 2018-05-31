const initialState = {
  cartData: [],
  cartItemsInfo: [],
  inProgress: false
};

/**
  Store the data for the cart and its details
*/

export default (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case 'USER_CART_ITEMS':
      return {
        ...state,
        cartData: payload.cartData,
      };
    case 'SAVE_NEW_CART':
      return {
        ...state,
        cartData: payload,
      };
    case 'SAVE_ITEM_INFO':
      return {
        ...state,
        cartItemsInfo: payload,
        inProgress: false
      };
    case 'SAVE_NEW_CART_INFO':
      return {
        ...state,
        cartItemsInfo: payload,
      };
    case 'IN_PROGRESS':
      return {
        ...state,
        inProgress: true
      }
    default:
      return state;
  }
};
