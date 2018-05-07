import { fork } from 'redux-saga/effects';
import attemptLoginSaga from './attemptLoginSaga';
import todoInitialFetchSaga from './todoInitialFetchSaga';
import submitTodoSaga from './submitTodoSaga';

function* rootSaga() {
  yield fork(attemptLoginSaga);
  yield fork(todoInitialFetchSaga);
  yield fork(submitTodoSaga);
}

export default rootSaga;