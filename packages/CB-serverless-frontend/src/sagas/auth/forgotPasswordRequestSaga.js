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

/**
 * Function called on receiving the action
 */
function* forgotPasswordRequest(action) {
  /**
   * Promise returned by forgotPassword method of AWS Amplify
   */
  const forgotPasswordRequestPromise = ({ username }) => Auth.forgotPassword(username);
  try {
    /**
     * Get username (email) value from the form
     */
    const { username } = yield select(forgotPasswordFormSelector);
    /**
     * Make Request to Cognito to trigger a forgot password request
     */
    yield call(forgotPasswordRequestPromise, { username });
    /**
     * Send an action to inform forgot password is in progress
     */
    yield put({
      type: 'FORGOT_PASSWORD_REQUESTED',
    });
  } catch (e) {
    /**
     * Trigger saga incase any error encountered
     */
    const loginFail = (() => (loginFailureSaga({ e, authScreen: 'login' })));
    yield call(loginFail);
  }
}

/**
 * Saga which takes latest actionType 'FORGOT_PASSWORD_REQUEST'
 */
function* forgotPasswordRequestSaga() {
  yield takeLatest('FORGOT_PASSWORD_REQUEST', forgotPasswordRequest);
}

export default forgotPasswordRequestSaga;
