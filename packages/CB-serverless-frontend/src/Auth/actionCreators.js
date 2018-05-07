export const attemptLogin = (authScreen, requireVerification) => {
  if (!requireVerification) {
    return {
      type: 'ATTEMPT_LOGIN',
      payload: {
        authScreen,
      }
    };
  } else {
    return {
      type: 'CONFIRM_SIGNUP',
      payload: {
        authScreen,
      }
    }
  }
}


export const updateAuth = (data) => ({
  type: 'UPDATE_AUTH',
  payload: {
    ...data,
  },
});