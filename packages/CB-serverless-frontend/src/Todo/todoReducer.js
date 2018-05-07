const initialState = {
  isFetching: true,
  isFetched: false,
};

export default (state = initialState, { type, payload = {}}) => {
  switch(type) {
    case 'INITIAL_FETCH_TODOS':
      return {
        isFetching: true,
        isFetched: false,
      }
    case 'INITIAL_FETCH_TODOS_SUCCESS':
      return {
        isFetching: false,
        isFetched: true,
        initialTodos: payload.initialTodos,
      }
    default: 
      return state;
  }
}