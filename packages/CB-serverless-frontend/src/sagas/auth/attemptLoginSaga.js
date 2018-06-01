import {
  takeLatest,
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';
import loginFailureSaga from './loginFailureSaga';

/**
 * Login Form Selector gets values stored in redux-store of the login form
 */
const loginFormSelector = state => state.form.login.values;


/**
 * Register form values in redux store
 */
const registerFormSelector = state => state.form.register.values;


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
 * Sign-Up promise returned by AWS Amplify 'signUp' method
 * @param name {string} full name of user, asked during sign-up
 * @param username {string} email for user, unique for each user
 * @param password {string} user's password
 * @param phone {number} user's phoneNumber
 * @returns {Promise<any>}
 */
const signUpPromise = ({
  name, username, password, phone,
}) => Auth.signUp({
  username,
  password,
  attributes: {
    name,
    phone_number: phone,
  },
});


/**
 * Login Promise returned by Amplify's 'signIn' method
 * @param username {string} email of user
 * @param password {string} password
 * @returns {Promise<any>}
 */
const loginPromise = ({ username, password }) => Auth.signIn(username, password);


/**
 * Login Function called on latest 'ATTEMPT_LOGIN' actionType
 * @param action
 */
function* loginAttempt(action) {
  /** Send a new action to mark login/register as in-progress */
  yield put({ type: 'IN_PROGRESS' });
  try {
    /**
     * action fired from register screen
     */
    if (action.payload.authScreen === 'register') {
      /**
       * Get all values entered in register form
       */
      const {
        name,
        username,
        password,
        phone,
      } = yield select(registerFormSelector);

      /**
       * Make an API call to AWS Cognito with the values in form
       */
      yield call(signUpPromise, {
        name,
        username,
        password,
        phone,
      });

      /**
       * Send a new action so that user enters the verification code to confirm sign-up
       * Verification code is sent on email-id
       */
      yield put({ type: 'VERIFICATION_CODE' });
    } else {
      /**
       * action fired from login screen
       */
      /**
       * Get values from login form
       */
      const {
        username,
        password,
      } = yield select(loginFormSelector);

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
  } catch (e) {
    console.log(e);
    /**
     * trigger an saga in case login values due to any error
     */
    const loginFail = (() => (loginFailureSaga({ e, authScreen: action.payload.authScreen })));
    yield call(loginFail);
  }
}

/**
 * Take Latest 'ATTEMPT_LOGIN' actionType and call the method
 */
function* attemptLoginSaga() {
  yield takeLatest('ATTEMPT_LOGIN', loginAttempt);
}

export default attemptLoginSaga;
