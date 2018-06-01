import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Amplify from 'aws-amplify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './index.css';
import './utils/string';

import registerServiceWorker from './registerServiceWorker';
import store from './store';
import Routes from './routes';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_APP_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'groceryApp',
        endpoint: process.env.REACT_APP_URL,
        region: process.env.REACT_APP_REGION,
      },
    ],
  },
});

const Index = () => (
  <MuiThemeProvider>
    <Provider store={store}>
      <Routes />
    </Provider>
  </MuiThemeProvider>
);

ReactDOM.render(<Index />, document.getElementById('root'));
registerServiceWorker();
