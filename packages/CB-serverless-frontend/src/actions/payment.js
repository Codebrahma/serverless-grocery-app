export const submitPaymentTokenId = ({
  tokenId, orderId, email, userId,
}) => ({
  type: 'SUBMIT_PAYMENT_TOKEN_ID',
  payload: {
    tokenId, orderId, email, userId,
  },
});

export const clearPayment = () => ({
  type: 'CLEAR_PAYMENT',
});
