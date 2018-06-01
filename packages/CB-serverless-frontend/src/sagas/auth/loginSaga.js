import {
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';

/**
 * Login Form Selector gets values stored in redux-store of the login form
 */
const loginFormSelector = state => state.form.login.values;

/**
 * Returns the signed-in user, (AWS Cognito)
 * contains the Token ID eg., idToken, accessToken, refreshToken
 */
const currentAuthenticatedUserPromise = () => Auth.currentAuthenticatedUser();

/**
 * Returns the signed in user's other data, ( which were asked during sign-up )
 * eg., Full Name, etc...
 */
const userDataPromise = () => Auth.currentUserInfo();

/**
 * Login Promise returned by Amplify's 'signIn' method
 * @param username {string} email of user
 * @param password {string} password
 * @returns {Promise<any>}
 */
const loginPromise = ({ username, password }) => Auth.signIn(username, password);

/**
 * Login Function to login the user
 * @param action
 */
function* loginSaga(username, password) {
  if (!username && !password) {
    const loginValues = yield select(loginFormSelector);
    username = loginValues.username;
    password = loginValues.password;
  }

  /**
   * Make an API request to sign in the user
   * with entered values
   */
  yield call(loginPromise, { username, password });

  /**
   * Get the credentials in case successful signIn
   * Contains the various token needed and other info
   */
  const currentCredentials = yield call(currentAuthenticatedUserPromise);

  /**
   * Get user's other attributes entered during sign-up
   * eg., FullName, Phone Number
   */
  const currentUserData = yield call(userDataPromise);

  /**
   * Send new action which saves all info
   * of the signed in user into the redux store
   */
  yield put({
    type: 'ATTEMPT_LOGIN_SUCCESS',
    payload: {
      identityId: currentCredentials,
      userData: currentUserData,
    },
  });
}

export default loginSaga;
