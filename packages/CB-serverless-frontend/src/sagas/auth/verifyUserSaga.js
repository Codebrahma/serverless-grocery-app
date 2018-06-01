import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

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

/**
 * Login promise returned by signIn method
 * @param username
 * @param password
 */
const loginPromise = ({ username, password }) => Auth.signIn(username, password);

/**
 * Promise which returns the authenticated users tokens
 */
const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();

/**
 * Promise which returns authenticated user's other info
 * eg., name, phone number
 */
const userDataPromise = () => Auth.currentUserInfo();

function* confirmCode(action) {
  yield put({
    type: 'IN_PROGRESS',
  });
  try {
    // get field values of username and password based on which screen the action was triggered from
    const { username, password } = action.payload.authScreen === 'register' ? yield select(registerFormSelector) :
      yield select(loginFormSelector);

    // get verification code inpu value
    const { verification } = yield select(verificationFormSelector);

    // Confirm the sign up for username with the entered code
    yield call(confirmSignUpPromise, { username, verification });

    // Sign the user in once the sign up is successful
    yield call(loginPromise, { username, password });

    // get user's credentials and other info
    const currentCredentials = yield call(currentAuthenticatedUserPromise);

    // get user's other info like name, phone number etc
    const currentUserData = yield call(userDataPromise);

    // save the values in redux store
    yield put({
      type: 'ATTEMPT_LOGIN_SUCCESS',
      payload: {
        identityId: currentCredentials,
        userData: currentUserData,
      },
    });
  } catch (e) {
    console.log(e);
    /**
     * Trigger the saga if any error occurs
     */
    const loginFail = (() => (loginFailureSaga({ e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

// Saga triggered for the action type 'CONFIRM_VERIFICATION_CODE'
function* verifyUserSaga() {
  yield takeLatest('CONFIRM_VERIFICATION_CODE', confirmCode);
}

export default verifyUserSaga;
