import { createSelector } from 'reselect';
import {userDataSelector} from './common/user-data';
import isEmpty from 'lodash/isEmpty';

export const profileHomeSelector = createSelector(
  [
    userDataSelector
  ], ({attributes}) => {
    const {phone_number, name, email, email_verified, phone_number_verified} = attributes;
    const isPhoneNumberEmpty = isEmpty(phone_number);
    const isFullNameEmpty = isEmpty(name);
    return {
      isPhoneNumberEmpty,
      isFullNameEmpty,
      phoneNumber: phone_number,
      name,
      email,
      emailVerified: email_verified,
      phoneNumberVerified: phone_number_verified
    };
  }
)
