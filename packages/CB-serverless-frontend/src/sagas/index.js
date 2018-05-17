import { fork } from 'redux-saga/effects';
import attemptLoginSaga from './attemptLoginSaga';
import cartItemsFetchSaga from './cartItemsFetchSaga';

function* rootSaga() {
  yield fork(attemptLoginSaga);
  yield fork(cartItemsFetchSaga);
}

export default rootSaga;
