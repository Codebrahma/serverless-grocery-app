import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import renderServerError from '../../utils/renderServerError';
import getResponse from '../../utils/getResponse';

awsConfigUpdate();

export const getGrocery = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    renderServerError(callback, 400, 'id should be provided')
  }

  var params = {
    TableName : 'grocery',
    Key: {
      groceryId: parseInt(event.queryStringParameters.id),
    }
  };

  const responsePromise = documentClient.get(params).promise();
  
  responsePromise
    .then((data) => {
      callback(null, getResponse(data));
    })
    .catch((err) => {
      renderServerError(callback, 500, JSON.stringify(err.message));
    });
}



