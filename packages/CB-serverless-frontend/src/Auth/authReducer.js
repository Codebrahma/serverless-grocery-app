const initialState = {
  isAuthenticating: false,
  isAuthenticated: false,
  userData: null,
  identityId: null,
  inProgress: false,
  authError: {
    type: null,
    message: null
  },
  passwordRequested: false,
  verifyUser: false
}

/**
  Store the authenticated userDetails along with accessToken.
*/

export default (state = initialState, { type, payload = {}}) => {
  switch(type) {
    case 'ATTEMPT_LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        authError: {
          type: null,
          message: null,
        },
        identityId: payload.identityId,
        userData: payload.userData,
        inProgress: false,
        passwordRequested: false,
        verifyUser: false
      }
    case 'CLEAN_AUTH':
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        authError: {
          type: null,
          message: null,
        },
        identityId: null,
        userData: null,
        inProgress: false,
        passwordRequested: false,
        verifyUser: false
      }
    case 'ATTEMPT_LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        isError: true,
        identityId: payload.identityId,
        userData: null,
        authError: {
          type: payload.type,
          message: payload.errorMessage,
        },
        inProgress: false,
      }
    case 'VERIFICATION_CODE':
        return {
          ...state,
          inProgress: false,
          passwordRequested: false,
          verifyUser: true,
        }
    case 'UPDATE_AUTH':
      return {
        ...state,
        ...payload,
        inProgress: false,
        passwordRequested: false,
        verifyUser: false
      }
    case 'IN_PROGRESS':
      return {
        ...state,
        inProgress: true
      }
    case 'FORGOT_PASSWORD_REQUESTED':
      return {
        ...state,
        passwordRequested: true
      }
    case 'CLEAR_FORGOT_PASSWORD':
      return {
        ...state,
        passwordRequested: false
      }
    case 'CLEAR_CODE_VERIFICATION':
      return {
        ...state,
        verifyUser: false,
      }
    default:
      return state;
  }
}
