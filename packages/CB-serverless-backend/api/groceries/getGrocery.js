import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

awsConfigUpdate();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    getErrorResponse(callback, 400, 'id should be provided')
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
      callback(null, getSuccessResponse(data));
    })
    .catch((err) => {
      getErrorResponse(callback, 500, JSON.stringify(err.message));
    });
}



