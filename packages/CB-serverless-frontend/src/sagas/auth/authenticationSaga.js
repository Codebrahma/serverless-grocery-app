import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import loginFailureSaga from './loginFailureSaga';
import registerSaga from './registerSaga';
import loginSaga from './loginSaga';

/**
 * Login Function called on latest 'ATTEMPT_LOGIN' actionType
 * @param action
 */
function* loginAttempt(action) {
  /** Send a new action to mark login/register as in-progress */
  yield put({type: 'IN_PROGRESS'});
  try {
    /**
     * action fired from register screen
     */
    if (action.payload.authScreen === 'register') {
      const register = () => registerSaga();
      yield call(register);
    } else {
      /**
       * action fired from login screen
       */
      const login = () => loginSaga();
      yield call(login);
    }
  } catch (e) {
    console.log(e);
    /**
     * trigger an saga in case login values due to any error
     */
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

/**
 * Take Latest 'ATTEMPT_LOGIN' actionType and call the method
 */
function* authenticationSaga() {
  yield takeLatest('ATTEMPT_LOGIN', loginAttempt);
}

export default authenticationSaga;
