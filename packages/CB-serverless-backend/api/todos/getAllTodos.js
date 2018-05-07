import mongoose from 'mongoose';

import connectToDatabase from './db';
import Todo from '../..//models/Todo';

const renderServerError = (response, errorMessage) => response(null, {
  statusCode: 500,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

export const getAllTodos = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { userId } = event.queryStringParameters || {};
  connectToDatabase().then(() => {
    console.log('Database connection done');
    Todo.find({ userId }, (error, data) => {
      console.log('Result', data);
      callback(null, { statusCode: 200, headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(data) })
    });
  })
  .catch(() => renderServerError(callback, 'Unable to fetch todos! Try again later'));
}
