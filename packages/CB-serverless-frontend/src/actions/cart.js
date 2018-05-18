export const fetchCartItems = (authScreen, requireVerification) => ({
  type: 'FETCH_CART_ITEMS',
});

export const updateCartItems = data => ({
  type: 'UPDATE_CART_ITEMS',
  payload: data,
});

export const addToCart = (groceryId, quantity) => ({
  type: 'ADD_TO_CART',
  payload: {
    groceryId,
    quantity,
  },
});
