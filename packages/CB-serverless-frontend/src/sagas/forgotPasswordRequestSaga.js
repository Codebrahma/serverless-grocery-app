import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

const forgotPasswordFormSelector = state => state.form.forgotPassword.values;

function* forgotPasswordRequest(action) {
  const forgotPasswordRequest = ({username}) => Auth.forgotPassword(username);
  try {
    const {username} = yield select(forgotPasswordFormSelector) ;
    yield call(forgotPasswordRequest, { username });
    yield put({
      type: 'FORGOT_PASSWORD_REQUESTED'
    });
  } catch (e) {
    const loginFail = (() => (loginFailureSaga({e, authScreen: 'login' })));
    yield call(loginFail);
  }
}

function* forgotPasswordRequestSaga() {
  yield takeLatest('FORGOT_PASSWORD_REQUEST', forgotPasswordRequest);
}

export default forgotPasswordRequestSaga;
