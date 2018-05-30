import { createSelector } from 'reselect';

export const userDataSelector = createSelector(
  [
    (state) => state.auth.userData,
  ], (userData) => {
    const {username, attributes} = userData;
    return ({
      username,
      attributes
    });
  }
)
