import {
  takeLatest,
  put,
  select,
  call,
  take,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';

const loginFormSelector = state => state.form.login.values;
const registerFormSelector = state => state.form.register.values;

function* loginAttempt(action) {
  const signUpPromise = ({
    name,
    username,
    password,
    phone }) => Auth.signUp({
      username,
      password,
      attributes: {
        name,
        'phone_number': phone,
      },
    });
  const confirmSignUpPromise = ({ username, verification }) => Auth.confirmSignUp(username, verification);
  const loginPromise = ({ username, password }) => Auth.signIn(username, password);
  const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();
  const userDataPromise = () => Auth.currentUserInfo();

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
      yield take('CONFIRM_SIGNUP');

      const { verification } = yield select(registerFormSelector);
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
    const errorMessage = typeof e === 'string' && e;
    console.log("=>>>>", errorMessage);
    yield put({
      type: 'ATTEMPT_LOGIN_FAILURE',
      payload: {
        errorMessage: e.message || errorMessage || 'Some error occured',
      },
    });

    try {
      yield take('CONFIRM_SIGNUP');
      const { username, password, verification } = yield select(registerFormSelector);

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
    }
  }
}

function* attemptLoginSaga() {
  yield takeLatest('ATTEMPT_LOGIN', loginAttempt);
}

export default attemptLoginSaga;
