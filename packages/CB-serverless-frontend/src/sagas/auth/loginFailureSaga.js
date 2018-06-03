import { put } from 'redux-saga/effects';
import { USER_NOT_VERIFIED, USER_ALREADY_EXIST } from '../../constants/app';

/**
 * Saga which handles the error on login/signup
 */
function* loginFailureSaga({e, authScreen}) {
  // check error message type
  let errorMessage = typeof e === 'string' && e;
  let userNotVerified = (e.code === 'UserNotConfirmedException')? USER_NOT_VERIFIED : null;

  // Check and switch based on different errors
  switch(e.code) {
    case 'UsernameExistsException':
      errorMessage = USER_ALREADY_EXIST;
      break;
    case 'UserNotConfirmedException':
      errorMessage = USER_NOT_VERIFIED;
      break;
  }

  // if error of type then send a 'CLEAN_AUTH' action
  const notAuthorized = (e.code === 'NotAuthorizedException');
  if (notAuthorized) {
    yield put({type: 'CLEAN_AUTH'});
  }

  // send an action of type which contains errorMessage
  yield put({
    type: 'ATTEMPT_LOGIN_FAILURE',
    payload: {
      type: authScreen,
      errorMessage: errorMessage || e.message || 'Some error occured',
    },
  });
}

export default loginFailureSaga;
