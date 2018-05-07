import { 
  takeLatest,
  put,
  select,
  call,
  take
} from 'redux-saga/effects';
import { API, Auth } from 'aws-amplify';
import map from 'lodash/map';
import moment from 'moment';

const formValueSelector = state => state.form.todoForm.values.todoList;
const userIdSelector = state => state.auth.identityId;

function* submitTodos(action) {
  try {
    const formValues = yield select(formValueSelector);
    const userId = yield select(userIdSelector);

    const processedTodos = map(formValues, (value) => {
      return {
        ...value,
        deleted: !value.active,
        dueDate: moment(value.dueDate).format('YYYY-MM-DDT00:00:00Z'),
        userId,
      }
    })

    const postTodos = (processedTodos) => API.post('todo', '/todos', {
      body: {
        todos: processedTodos,
      }
    });

    yield call(postTodos, processedTodos)
    yield put({
      type: 'INITIAL_FETCH_TODOS',
    })
  } catch(e) {
    console.log(e);
  }
  
}

function* submitTodoSaga() {
  yield takeLatest('SUBMIT_TODOS', submitTodos);
}

export default submitTodoSaga;


