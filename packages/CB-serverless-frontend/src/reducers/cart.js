const initialState = {
  cartData: null,
}

export default (state = initialState, { type, payload = {}}) => {
  switch(type) {
    case 'USER_CART_ITEMS':
      return {
        ...state,
        cartData: payload.cartData
      }
    default:
      return state;
  }
}
