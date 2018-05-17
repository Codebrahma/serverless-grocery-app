export const addToCart = (groceryId, quantity) => ({
  type: 'ADD_TO_CART',
  payload: {
    groceryId,
    quantity,
  },
});
