import {
  put,
  select,
  call,
} from 'redux-saga/effects';
import { Auth } from 'aws-amplify';

/**
 * Register form values in redux store
 */
const registerFormSelector = state => state.form.register.values;

/**
 * Sign-Up promise returned by AWS Amplify 'signUp' method
 * @param name {string} full name of user, asked during sign-up
 * @param username {string} email for user, unique for each user
 * @param password {string} user's password
 * @param phone {number} user's phoneNumber
 * @returns {Promise<any>}
 */
const signUpPromise = ({name, username, password, phone}) => Auth.signUp({
  username,
  password,
  attributes: {
    name,
    'phone_number': phone,
  },
});


/**
 * Register the user
 */
function* registerSaga() {
  const { name, username, password, phone } = yield select(registerFormSelector);

  /**
   * Make an API call to AWS Cognito with the values in form
   */
  yield call(signUpPromise, {
    name,
    username,
    password,
    phone
  });

  /**
   * Send a new action so that user enters the verification code to confirm sign-up
   * Verification code is sent on email-id
   */
  yield put({type: 'VERIFICATION_CODE'});
}

export default registerSaga;
