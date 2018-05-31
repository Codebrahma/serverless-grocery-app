import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

/**
 * Get values from forgotPassword form
 */
const forgotPasswordFormSelector = state => state.form.forgotPassword.values;

function* forgotPassword(action) {
  /**
   * Promise returned by the 'signIn' method of Amplify
   * @param username {string} email of user
   * @param password {string} password
   * @returns {Promise<any>}
   */
  const loginPromise = ({ username, password }) => Auth.signIn(username, password);
  /**
   * Promise returned by Amplify library for forgotPassword
   * @param username {string} email of user
   * @param code {number} code sent on email of user, required to reset password
   * @param password {string} new password
   */
  const forgotPasswordPromise = ({
    username, code, password,
  }) => Auth.forgotPasswordSubmit(username, code, password);

  /**
   * Promise to get the authenticated user after the password changes
   */
  const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();
  /**
   * Promise to get User's info other than email
   */
  const userDataPromise = () => Auth.currentUserInfo();
  try {
    // send action to notify task in progess
    yield put({ type: 'IN_PROGRESS' });

    // Get the values from the forgotPassword form
    const { username, code, password } = yield select(forgotPasswordFormSelector);

    // Call the promise with the input values of form
    yield call(forgotPasswordPromise, { username, code, password });

    // Sign the user in, once password change is successful
    yield call(loginPromise, { username, password });

    // Get User credentials eg., all token etc
    const currentCredentials = yield call(currentAuthenticatedUserPromise);

    // Get User other info, eg., name, phone number
    const currentUserData = yield call(userDataPromise);

    // send action to mark login success and save all info
    yield put({
      type: 'ATTEMPT_LOGIN_SUCCESS',
      payload: {
        identityId: currentCredentials,
        userData: currentUserData,
      },
    });
  } catch (e) {
    console.log(e);
    // Call the saga in case any error occurs
    const loginFail = (() => (loginFailureSaga({ e, authScreen: 'login' })));
    yield call(loginFail);
  }
}

/**
 * Saga to call on action type 'FORGOT_PASSWORD'
 */
function* forgotPasswordSaga() {
  yield takeLatest('FORGOT_PASSWORD', forgotPassword);
}

export default forgotPasswordSaga;
