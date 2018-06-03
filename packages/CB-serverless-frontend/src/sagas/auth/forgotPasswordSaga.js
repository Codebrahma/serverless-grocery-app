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
 * Get values from forgotPassword form
 */
const forgotPasswordFormSelector = state => state.form.forgotPassword.values;

function* forgotPassword(action) {
  /**
   * Promise returned by Amplify library for forgotPassword
   * @param username {string} email of user
   * @param code {number} code sent on email of user, required to reset password
   * @param password {string} new password
   */
  const forgotPasswordPromise = ({username, code, password}) => Auth.forgotPasswordSubmit(username, code, password);
  try {
    // send action to notify task in progess
    yield put({type: 'IN_PROGRESS'});

    // Get the values from the forgotPassword form
    const {username, code, password} = yield select(forgotPasswordFormSelector) ;

    // Call the promise with the input values of form
    yield call(forgotPasswordPromise, { username, code, password});

    // Sign the user in, once password change is successful
    const login = () => loginSaga(username, password);
    yield call(login);
  } catch (e) {
    console.log(e);
    // Call the saga in case any error occurs
    const loginFail = (() => (loginFailureSaga({e, authScreen: 'login' })));
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
