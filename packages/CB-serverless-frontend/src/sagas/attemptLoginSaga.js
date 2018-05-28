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
const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();
const userDataPromise = () => Auth.currentUserInfo();
const signUpPromise = ({name, username, password,phone }) => Auth.signUp({
  username,
  password,
  attributes: {
    name,
    'phone_number': phone,
  },
});
const loginPromise = ({ username, password }) => Auth.signIn(username, password);

function* loginAttempt(action) {
  yield put({type: 'IN_PROGRESS'});
  try {
    if (action.payload.authScreen === 'register') {
      const {
        name,
        username,
        password,
        phone
      } = yield select(registerFormSelector);
      yield call(signUpPromise, {
        name,
        username,
        password,
        phone
      });
      yield put({type: 'VERIFICATION_CODE'});
    } else {
      const {
        username,
        password,
      } = yield select(loginFormSelector);

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
    }
  } catch (e) {
    console.log(e);
    const loginFail = (() => (loginFailureSaga({e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

function* attemptLoginSaga() {
  yield takeLatest('ATTEMPT_LOGIN', loginAttempt);
}

export default attemptLoginSaga;
