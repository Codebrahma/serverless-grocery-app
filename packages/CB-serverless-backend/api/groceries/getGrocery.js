import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import renderServerError from '../../utils/renderServerError';
import getResponse from '../../utils/getResponse';

awsConfigUpdate();

export const getGrocery = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  var params = {
    TableName : 'grocery',
    Key: {
      groceryId: event.queryStringParameters.id,
    }
  };

  documentClient.get(params, function(err, data) {
    if (err) {
      console.log(err);
      renderServerError(callback, 'Unable to fetch! Try again later');
    }
    else {
      callback(null, getResponse(data));
    }
  });
}



