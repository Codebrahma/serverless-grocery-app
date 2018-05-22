export const submitPaymentTokenId = ({tokenId, orderId, email, userId}) => {
  return {
    type: 'SUBMIT_PAYMENT_TOKEN_ID',
    payload: {tokenId, orderId, email, userId}
  }
}
