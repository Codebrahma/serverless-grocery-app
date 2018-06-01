import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';
import loginSaga from './loginSaga';

/**
 * Get field values of login form
 */
const loginFormSelector = state => state.form.login.values;

/**
 * Get field values of register form
 */
const registerFormSelector = state => state.form.register.values;

/**
 * Get value of verification code field
 */
const verificationFormSelector = state => state.form.verification.values;

/**
 * Promise returned by confirmSignUp method
 * @param username {string} email
 * @param verification {number} code sent on email of user, required to confirm sign up
 */
const confirmSignUpPromise = ({ username, verification }) => Auth.confirmSignUp(username, verification);

function* confirmCode(action) {
  yield put({
    type: 'IN_PROGRESS',
  });
  try {
    // get field values of username and password based on which screen the action was triggered from
    const {username, password} = action.payload.authScreen === 'register'? yield select(registerFormSelector) :
      yield select(loginFormSelector) ;

    // get verification code inpu value
    const {verification} = yield select(verificationFormSelector);

    // Confirm the sign up for username with the entered code
    yield call(confirmSignUpPromise, { username, verification });

    // Sign the user in once the sign up is successful
    const login = () => loginSaga(username, password);
    yield call(login);
  } catch (e) {
    console.log(e);
    /**
     * Trigger the saga if any error occurs
     */
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

// Saga triggered for the action type 'CONFIRM_VERIFICATION_CODE'
function* verifyUserSaga() {
  yield takeLatest('CONFIRM_VERIFICATION_CODE', confirmCode);
}

export default verifyUserSaga;
