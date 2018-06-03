import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

/**
 * Get login form field values
 */
const loginFormSelector = state => state.form.login.values;

/**
 * Get register form field values
 */
const registerFormSelector = state => state.form.register.values;

/**
 * When user's hasn't entered the verification code during sign-up
 * Call this promise once more to resend the code and verify
 */
const requestVC = ({ username }) => Auth.resendSignUp(username);

/**
 * Call the saga to handle the action
 */
function* requestCode(action) {
  // Mark the process as in progress
  yield put({type: 'IN_PROGRESS'});
  try {
    /**
     * if screen is register screen then get username value from that form
     * else get username value form login form
     */
    const {username} = action.payload.authScreen === 'register'? yield select(registerFormSelector) :
      yield select(loginFormSelector) ;

    // Request to send the verification code once again for the username
    yield call(requestVC, { username });
    yield put({
      type: 'VERIFICATION_CODE',
      payload: {authScreen: action.payload.authScreen},
    });
  } catch (e) {
    console.log(e);
    /**
     * trigger saga in case any error occurs
     */
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

/**
 *  Saga function which takes the action REQUEST_VERIFICATION_CODE
 */

function* requestVerificationCodeSaga() {
  yield takeLatest('REQUEST_VERIFICATION_CODE', requestCode);
}

export default requestVerificationCodeSaga;
