import Amplify from 'aws-amplify';
import { getGrocery } from './api/todos';
import { getGroceries } from './api/todos';
import { registerUser } from './api/todos'
import config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'todo',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

export { 
  getGrocery,
	getGroceries,
	registerUser,
	// verifyUser,
}
