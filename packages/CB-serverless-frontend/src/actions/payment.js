export const submitPaymentTokenId = ({tokenId, orderId, email}) => {
  return {
    type: 'SUBMIT_PAYMENT_TOKEN_ID',
    payload: {tokenId, orderId, email}
  }
}
