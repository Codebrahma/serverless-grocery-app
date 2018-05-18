import { fork } from 'redux-saga/effects';
import attemptLoginSaga from './attemptLoginSaga';
import cartItemsFetchSaga from './cartItemsFetchSaga';
import cartItemsAddSaga from './cartItemsAddSaga';

function* rootSaga() {
  yield fork(attemptLoginSaga);
  yield fork(cartItemsFetchSaga);
  yield fork(cartItemsAddSaga);
}

export default rootSaga;
