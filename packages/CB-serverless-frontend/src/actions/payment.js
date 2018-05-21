export const submitPaymentTokenId = (tokenId) => {
  return {
    type: 'SUBMIT_PAYMENT_TOKEN_ID',
    payload: {tokenId}
  }
}
