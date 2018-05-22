import { isNil } from 'lodash';

export const saveTokenInStorage = (currentCredentials) => {
  if (!isNil(currentCredentials) && !isNil(currentCredentials.signInUserSession)) {
    localStorage.removeItem('userSession');
    localStorage.setItem('userSession', JSON.stringify(currentCredentials));
  }
};

export const removeTokenFromStorage = () => {
  try {
    localStorage.removeItem('userSession');
  } catch (e) {
    console.log('Error removing token', e);
  }
};

