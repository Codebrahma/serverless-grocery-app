import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

const forgotPasswordFormSelector = state => state.form.forgotPassword.values;

function* forgotPassword(action) {
  const loginPromise = ({ username, password }) => Auth.signIn(username, password);
  const forgotPasswordPromise = ({username, code, password}) => Auth.forgotPasswordSubmit(username, code, password);
  const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();
  const userDataPromise = () => Auth.currentUserInfo();
  try {
    yield put({type: 'IN_PROGRESS'});
    const {username, code, password} = yield select(forgotPasswordFormSelector) ;

    yield call(forgotPasswordPromise, { username, code, password});
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
    const loginFail = (() => (loginFailureSaga({e, authScreen: 'login' })));
    yield call(loginFail);
  }
}

function* forgotPasswordSaga() {
  yield takeLatest('FORGOT_PASSWORD', forgotPassword);
}

export default forgotPasswordSaga;
