import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, combineReducers, applyMiddleware } from 'redux';


import rootSaga from './sagas';
import authReducer from './Auth/authReducer';
import todoReducer from './Todo/todoReducer';
import cart from './reducers/cart';
import rootSaga from './sagas';

const logger = createLogger({});
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  cart,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware, logger)));

sagaMiddleware.run(rootSaga);

export default store;
