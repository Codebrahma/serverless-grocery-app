import map from 'lodash/map';
import pick from 'lodash/pick';
import moment from 'moment';

const requiredParams = ['user', 'title', 'description'];

export const getInitialTodos = (state) => {
  const result = map(state.todos.initialTodos, (todo) => {
    return {
      ...pick(todo, requiredParams),
      id: todo._id,
      dueDate: todo.dueDate && moment(todo.dueDate).toDate(),
      active: true,
    };
  });
  return {
    todoList: result,
  };
}

export const getTodoFormValues = (state) => {
  return state.form.todoForm && state.form.todoForm.values && state.form.todoForm.values.todoList;
}