import { 
  takeLatest,
  put,
  select,
  call,
  take
} from 'redux-saga/effects';
import { API, Auth } from 'aws-amplify';

const identityIdSelector = state => state.auth.identityId;
function* todoInitialFetch(action) {
  try {
    const identityId = yield select(identityIdSelector);
    const getTodos = () => API.get('todo', `/todos?userId=${identityId}`);
    const todos = yield call(getTodos);
    yield put({
      type: 'INITIAL_FETCH_TODOS_SUCCESS',
      payload: {
        initialTodos: todos,
      }
    })
  } catch(e) {
    console.log(e);
  }
  
}

function* todoInitialFetchSaga() {
  yield takeLatest('INITIAL_FETCH_TODOS', todoInitialFetch);
}

export default todoInitialFetchSaga;


