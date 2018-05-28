export const attemptLogin = (authScreen, requireVerification) => {
  return (requireVerification? {
    type: 'CONFIRM_VERIFICATION_CODE',
    payload: {authScreen}
  } : {
    type: 'ATTEMPT_LOGIN',
    payload: {authScreen}
  });
}

export const requestCodeVerification = (authScreen) => ({
    type: 'REQUEST_VERIFICATION_CODE',
    payload: authScreen
  })


export const updateAuth = (data) => ({
  type: 'UPDATE_AUTH',
  payload: {
    ...data,
  },
});

export const forgotPasswordRequest = (requested) => {
  return (requested? {type: 'FORGOT_PASSWORD'} : {type: 'FORGOT_PASSWORD_REQUEST'});
};

export const clearCodeVerification = () => ({
  type: 'CLEAR_CODE_VERIFICATION'
});

export const clearForgotPasswordRequest = () => ({
  type: 'CLEAR_FORGOT_PASSWORD'
})
