import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

const loginFormSelector = state => state.form.login.values;
const registerFormSelector = state => state.form.register.values;
const requestVC = ({ username }) => Auth.resendSignUp(username);

function* requestCode(action) {
  yield put({type: 'IN_PROGRESS'});
  try {
    const {username} = action.payload.authScreen === 'register'? yield select(registerFormSelector) :
      yield select(loginFormSelector) ;
      
    yield call(requestVC, { username });
    yield put({
      type: 'VERIFICATION_CODE',
      payload: {authScreen: action.payload.authScreen},
    });
  } catch (e) {
    console.log(e);
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

function* requestVerificationCodeSaga() {
  yield takeLatest('REQUEST_VERIFICATION_CODE', requestCode);
}

export default requestVerificationCodeSaga;
