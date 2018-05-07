import React from 'react';
import FormComponent from './profile';

import config from '../../config';
import { API } from 'aws-amplify';

const Profile = () => {
const  handleSubmit = async (values) => {
  API.post('todo', '/profile', {
    body: values,
  })
};
	return (
		<FormComponent
			onSubmit={handleSubmit}
		/>
	);
}
export default Profile;