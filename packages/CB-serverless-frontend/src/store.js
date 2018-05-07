import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import authReducer from './Auth/authReducer';
import todoReducer from './Todo/todoReducer';
import rootSaga from './sagas';

const logger = createLogger({});
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth: authReducer,
  todos: todoReducer,
  form: formReducer,
});

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);

export default store;