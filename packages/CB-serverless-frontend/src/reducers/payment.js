const initialState = {
  paymentComplete: null,
  paymentError: null,
  paymentInProgress: null
}

/**
  Store the payment status: inProgress, completed or failed
*/

export default (state = initialState, { type, payload = {}}) => {
  switch(type) {
    case 'PAYMENT_IN_PROGRESS':
      return {
        ...state,
        paymentComplete: false,
        paymentInProgress: true,
        paymentError: null
      }
    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        paymentComplete: true,
        paymentInProgress: false,
        paymentError: null
      }
    case 'PAYMENT_FAILURE':
      return {
        ...state,
        paymentComplete: false,
        paymentInProgress: false,
        paymentError: payload.error
      }
    case 'CLEAR_PAYMENT':
      return {
        ...state,
        paymentComplete: null,
        paymentInProgress: null,
        paymentError: null
      }
    default:
      return state;
  }
}
