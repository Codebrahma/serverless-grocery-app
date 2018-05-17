const initialState = {
  isAuthenticating: false,
  isAuthenticated: false,
  userData: null,
  identityId: null,
}

export default (state = initialState, { type, payload = {}}) => {
  switch(type) {
    case 'ATTEMPT_LOGIN':
      return {
        ...state,
        isAuthenticating: payload.authScreen !== 'register',
        isAuthenticated: false,
        errorMessage: payload.authScreen === 'register' ? 'User is not confirmed.' : null,
        identityId: null,
        userData: null
      }
    case 'ATTEMPT_LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        errorMessage: null,
        identityId: payload.identityId,
        userData: payload.userData
      }
    case 'ATTEMPT_LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        isError: true,
        identityId: payload.identityId,
        userData: null,
        errorMessage: payload.errorMessage,
      }
    case 'UPDATE_AUTH':
      return {
        ...state,
        ...payload,
      }
    default:
      return state;
  }
}
