import { put } from 'redux-saga/effects';
import { USER_NOT_VERIFIED, USER_ALREADY_EXIST } from '../constants/app';

function* loginFailureSaga({e, authScreen}) {
  let errorMessage = typeof e === 'string' && e;
  let userNotVerified = (e.code === 'UserNotConfirmedException')? USER_NOT_VERIFIED : null;
  switch(e.code) {
    case 'UsernameExistsException':
      errorMessage = USER_ALREADY_EXIST;
      break;
    case 'UserNotConfirmedException':
      errorMessage = USER_NOT_VERIFIED;
      break;
  }
  const notAuthorized = (e.code === 'NotAuthorizedException');
  if (notAuthorized) {
    yield put({type: 'CLEAN_AUTH'});
  }
  yield put({
    type: 'ATTEMPT_LOGIN_FAILURE',
    payload: {
      type: authScreen,
      errorMessage: errorMessage || e.message || 'Some error occured',
    },
  });
}

export default loginFailureSaga;
