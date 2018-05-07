import mongoose from 'mongoose';

import connectToDatabase from '../../db';
import Todo from '../../models/Todo';

const processTodo = (todo) => {
  const promise = new Promise((resolve, reject) => {
    const query = { _id: todo.id };
    const isDeleteOperation = todo.deleted;
    const callback = (err, data) => {
      console.log('Error', err);
      console.log('data', data);
      err ? reject(err) : resolve(isDeleteOperation ? null : data._id)
    };

    if ( todo.id ) {
      isDeleteOperation ? Todo.findByIdAndRemove(query, callback) : Todo.findByIdAndUpdate(todo.id, todo, {}, callback);
    } else {
      Todo.create(todo, callback);
    }
  });
  return promise;
}

const renderServerError = (response, errorMessage) => response(null, {
  statusCode: 500,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

export const processTodos = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { todos } = JSON.parse(event.body) || {};
  connectToDatabase()
    .then(() => {
      Promise.all(todos.map(processTodo))
        .then((ids) => {
          const todoIds = ids.filter((id) => (!!id)).map((id) => new mongoose.Types.ObjectId(id));
          Todo.find({ '_id' : { $in: todoIds } }, (error, data) => callback(null, { statusCode: 200, body: JSON.stringify(data) }));
        })
        .catch((e) => renderServerError(callback, 'Unable to process todos! Try again later' + e.stack));
    })
    .catch((e) => renderServerError(callback, 'Unable to process todos! Try again later' + e.stack));
};