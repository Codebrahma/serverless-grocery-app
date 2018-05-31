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
const verificationFormSelector = state => state.form.verification.values;

const confirmSignUpPromise = ({ username, verification }) => Auth.confirmSignUp(username, verification);
const loginPromise = ({ username, password }) => Auth.signIn(username, password);
const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();
const userDataPromise = () => Auth.currentUserInfo();

function* confirmCode(action) {
  yield put({
    type: 'IN_PROGRESS',
  });
  try {
    const {username, password} = action.payload.authScreen === 'register'? yield select(registerFormSelector) :
      yield select(loginFormSelector) ;
    const {verification} = yield select(verificationFormSelector);

    yield call(confirmSignUpPromise, { username, verification });
    yield call(loginPromise, { username, password });

    const currentCredentials = yield call(currentAuthenticatedUserPromise);
    const currentUserData = yield call(userDataPromise);
    yield put({
      type: 'ATTEMPT_LOGIN_SUCCESS',
      payload: {
        identityId: currentCredentials,
        userData: currentUserData,
      },
    });
  } catch (e) {
    console.log(e);
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

function* verifyUserSaga() {
  yield takeLatest('CONFIRM_VERIFICATION_CODE', confirmCode);
}

export default verifyUserSaga;
